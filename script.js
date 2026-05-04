// ScoreBowl - Application de gestion de concours
// Données et état de l'application

let participants = [];
let currentSort = 'rank';
let sortDirection = 'asc'; // 'asc' ou 'desc'
let nextId = 1;
let simpleView = false; // Vue simplifiée (masque les colonnes de scores individuels)
const urlParams = new URLSearchParams(globalThis.location.search);
const isDisplayMode = urlParams.get('mode') === 'display';
const displayCategory = urlParams.get('category') || 'adults';
let currentCategory = isDisplayMode ? displayCategory : 'adults'; // 'adults' ou 'children'
let displayRefreshInterval = null;
let displayScrollInterval = null;
let displayResizeHandler = null;
let displayDataFingerprint = '';
let displayScrollStartTimeout = null;

// Clés pour le localStorage (dépendent de la catégorie)
function getStorageKey() {
    return `scorebowl_participants_${currentCategory}`;
}
const SETTINGS_KEY = 'scorebowl_settings';
const CATEGORY_KEY = 'scorebowl_current_category';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function () {
    migrateOldData();
    if (!isDisplayMode) {
        // Restaurer la dernière catégorie utilisée
        const savedCategory = localStorage.getItem(CATEGORY_KEY);
        if (savedCategory === 'adults' || savedCategory === 'children') {
            currentCategory = savedCategory;
        }
    }
    loadData();
    initializeMode();
    updateDisplay();
    if (!isDisplayMode) {
        updateCategoryButtons();
        updateViewToggleButton();
        updateTableColumns();
    }
    setupEventListeners();
    console.log('ScoreBowl initialized');
});

// Configuration des event listeners
function setupEventListeners() {
    if (isDisplayMode) {
        return;
    }

    // Event listener pour la recherche
    document.getElementById('searchInput').addEventListener('input', filterParticipants);

    // Event listener pour l'import de fichier
    document.getElementById('importFile').addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.participants && Array.isArray(data.participants)) {
                        participants = data.participants;
                        nextId = Math.max(...participants.map(p => p.id)) + 1;
                        updateDisplay();
                        saveData();
                        showToast('Données importées avec succès');
                        bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
                    } else {
                        alert('Format de fichier invalide');
                    }
                } catch (error) {
                    alert('Erreur lors de la lecture du fichier');
                }
            };
            reader.readAsText(file);
        }
    });
}

// Gestion des participants
function addParticipant() {
    if (isDisplayMode) return;

    const defaultName = `Participant ${participants.length + 1}`;
    const name = safePrompt('Nom du participant:', defaultName);
    if (name === null) {
        return;
    }

    const participant = {
        id: nextId++,
        name: (name || '').trim() || defaultName,
        score1: 0,
        score2: 0,
        score3: 0,
        total: 0,
        rank: 0
    };
    participants.push(participant);
    updateRankings();
    updateDisplay();
    saveData();
    showToast('Participant ajouté');

    // Focus sur le nom du nouveau participant
    setTimeout(() => {
        const nameInput = document.querySelector(`[data-participant-id="${participant.id}"][data-field="name"]`);
        if (nameInput) {
            nameInput.focus();
            nameInput.select();
        }
    }, 100);
}

function deleteParticipant(id) {
    if (isDisplayMode) return;

    const participant = participants.find(p => p.id === id);
    if (participant) {
        showDeleteConfirmation(participant);
    }
}

function duplicateParticipant(id) {
    if (isDisplayMode) return;

    const participant = participants.find(p => p.id === id);
    if (!participant) return;

    const defaultName = `${participant.name} (copie)`;
    const newName = safePrompt('Nom du nouveau participant:', defaultName);
    if (newName === null) {
        return;
    }

    const duplicatedParticipant = {
        id: nextId++,
        name: (newName || '').trim() || defaultName,
        score1: participant.score1,
        score2: participant.score2,
        score3: participant.score3,
        total: participant.total,
        rank: 0
    };
    participants.push(duplicatedParticipant);
    updateRankings();
    updateDisplay();
    saveData();
    showToast(`Participant "${duplicatedParticipant.name}" dupliqué avec les scores de "${participant.name}"`);

    // Focus sur le nom du nouveau participant
    setTimeout(() => {
        const nameInput = document.querySelector(`[data-participant-id="${duplicatedParticipant.id}"][data-field="name"]`);
        if (nameInput) {
            nameInput.focus();
            nameInput.select();
        }
    }, 100);
}

function resetParticipantScores(id) {
    if (isDisplayMode) return;

    const participant = participants.find(p => p.id === id);
    if (!participant) return;

    if (confirm(`Remettre à zéro tous les scores de ${participant.name} ?`)) {
        participant.score1 = 0;
        participant.score2 = 0;
        participant.score3 = 0;
        participant.total = 0;
        updateRankings();
        updateDisplay();
        saveData();
        showToast(`Scores de "${participant.name}" remis à zéro`);
    }
}

function clearAllData() {
    if (isDisplayMode) return;

    if (participants.length === 0) {
        showToast('Aucune donnée à supprimer');
        return;
    }
    showClearConfirmation();
}

function updateParticipant(id, field, value) {
    if (isDisplayMode) return;

    const participant = participants.find(p => p.id === id);
    if (!participant) return;

    if (field === 'name') {
        participant.name = value.trim() || `Participant ${id}`;
    } else if (['score1', 'score2', 'score3'].includes(field)) {
        const numValue = parseInt(value) || 0;
        participant[field] = Math.max(0, numValue); // Empêche les scores négatifs
        participant.total = participant.score1 + participant.score2 + participant.score3;
        updateRankings();
    }

    updateDisplay();
    saveData();
    showToast('Données sauvegardées');
}

// Calcul des classements
function updateRankings() {
    // Trier par total décroissant
    participants.sort((a, b) => b.total - a.total);

    // Attribuer les rangs (gestion des égalités)
    let currentRank = 1;
    for (let i = 0; i < participants.length; i++) {
        if (i > 0 && participants[i].total < participants[i - 1].total) {
            currentRank = i + 1;
        }
        participants[i].rank = currentRank;
    }
}

// Affichage et interface utilisateur
function updateDisplay() {
    if (isDisplayMode) {
        updateDisplayScreen();
        return;
    }

    updateStats();
    updateTable();
    updateEmptyState();
    updateSortButtons();
}

function updateStats() {
    const totalElement = document.getElementById('totalParticipants');
    const bestElement = document.getElementById('bestScore');
    const averageElement = document.getElementById('averageScore');

    totalElement.textContent = participants.length;

    if (participants.length > 0) {
        const totals = participants.map(p => p.total);
        const bestScore = Math.max(...totals);
        const averageScore = totals.reduce((a, b) => a + b, 0) / totals.length;

        bestElement.textContent = bestScore;
        averageElement.textContent = averageScore.toFixed(1);
    } else {
        bestElement.textContent = '-';
        averageElement.textContent = '-';
    }
}

function updateTable() {
    const tbody = document.getElementById('participantsBody');
    tbody.innerHTML = '';

    const sortedParticipants = getSortedParticipants();

    sortedParticipants.forEach(participant => {
        const row = createParticipantRow(participant);
        tbody.appendChild(row);
    });
}

function createParticipantRow(participant) {
    const row = document.createElement('tr');
    row.className = 'participant-row';
    row.setAttribute('data-participant-id', participant.id);

    const score1Html = simpleView ? '' : `
        <td class="text-center score-column">
            <input type="number"
                   class="editable-input"
                   value="${participant.score1}"
                   data-participant-id="${participant.id}"
                   data-field="score1"
                   min="0"
                   step="1">
        </td>`;

    const score2Html = simpleView ? '' : `
        <td class="text-center score-column">
            <input type="number"
                   class="editable-input"
                   value="${participant.score2}"
                   data-participant-id="${participant.id}"
                   data-field="score2"
                   min="0"
                   step="1">
        </td>`;

    const score3Html = simpleView ? '' : `
        <td class="text-center score-column">
            <input type="number"
                   class="editable-input"
                   value="${participant.score3}"
                   data-participant-id="${participant.id}"
                   data-field="score3"
                   min="0"
                   step="1">
        </td>`;

    row.innerHTML = `
        <td class="text-center">
            <span class="rank-badge ${getRankClass(participant.rank)}">${participant.rank}</span>
        </td>
        <td>
            <input type="text"
                   class="editable-input name-input"
                   value="${escapeHtml(participant.name)}"
                   data-participant-id="${participant.id}"
                   data-field="name"
                   placeholder="Nom du participant">
            <button class="btn btn-link btn-sm p-0 ms-1 quick-edit-btn" onclick="openQuickEdit(${participant.id})" title="Édition rapide des scores">
                <i class="bi bi-pencil-square"></i>
            </button>
        </td>
        ${score1Html}
        ${score2Html}
        ${score3Html}
        <td class="text-center">
            <span class="total-score">${participant.total}</span>
        </td>
        <td class="text-center">
            <div class="dropdown">
                <button class="btn-action btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title="Actions">
                    <i class="bi bi-gear"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item" href="#" onclick="duplicateParticipant(${participant.id})">
                            <i class="bi bi-files text-primary"></i> Dupliquer
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#" onclick="resetParticipantScores(${participant.id})">
                            <i class="bi bi-arrow-clockwise text-warning"></i> Réinitialiser scores
                        </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <a class="dropdown-item text-danger" href="#" onclick="deleteParticipant(${participant.id})">
                            <i class="bi bi-trash"></i> Supprimer
                        </a>
                    </li>
                </ul>
            </div>
        </td>
    `;

    // Ajouter les event listeners pour les inputs
    const inputs = row.querySelectorAll('.editable-input');
    inputs.forEach(input => {
        input.addEventListener('blur', handleInputChange);
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        });
    });

    return row;
}

function handleInputChange(event) {
    const input = event.target;
    const participantId = parseInt(input.getAttribute('data-participant-id'));
    const field = input.getAttribute('data-field');
    const value = input.value;

    updateParticipant(participantId, field, value);
}

function getRankClass(rank) {
    switch (rank) {
        case 1: return 'rank-1';
        case 2: return 'rank-2';
        case 3: return 'rank-3';
        default: return 'rank-other';
    }
}

function updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('participantsTable');

    if (participants.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        table.style.display = 'table';
    }
}

// Tri et filtrage
function getSortedParticipants() {
    let sorted = [...participants];

    switch (currentSort) {
        case 'rank':
            if (sortDirection === 'asc') {
                sorted.sort((a, b) => a.rank - b.rank);
            } else {
                sorted.sort((a, b) => b.rank - a.rank);
            }
            break;
        case 'name':
            if (sortDirection === 'asc') {
                sorted.sort((a, b) => a.name.localeCompare(b.name));
            } else {
                sorted.sort((a, b) => b.name.localeCompare(a.name));
            }
            break;
    }

    return sorted;
}

function sortBy(criteria) {
    // Si on clique sur le même critère, inverser la direction
    if (currentSort === criteria) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        // Nouveau critère, commencer par croissant
        currentSort = criteria;
        sortDirection = 'asc';
    }

    updateDisplay();
    updateSortButtons();
    saveSettings();
}

function updateSortButtons() {
    // Réinitialiser tous les boutons
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activer le bouton actuel et mettre à jour le texte
    const rankBtn = document.getElementById('sortRankBtn');
    const nameBtn = document.getElementById('sortNameBtn');

    if (currentSort === 'rank') {
        rankBtn.classList.add('active');
        if (sortDirection === 'asc') {
            rankBtn.innerHTML = '<i class="bi bi-sort-numeric-down"></i> Classement ↓';
        } else {
            rankBtn.innerHTML = '<i class="bi bi-sort-numeric-up"></i> Classement ↑';
        }
        nameBtn.innerHTML = '<i class="bi bi-sort-alpha-down"></i> Nom ↓';
    } else if (currentSort === 'name') {
        nameBtn.classList.add('active');
        if (sortDirection === 'asc') {
            nameBtn.innerHTML = '<i class="bi bi-sort-alpha-down"></i> Nom ↓';
        } else {
            nameBtn.innerHTML = '<i class="bi bi-sort-alpha-up"></i> Nom ↑';
        }
        rankBtn.innerHTML = '<i class="bi bi-sort-numeric-down"></i> Classement ↓';
    }
}

function filterParticipants() {
    if (isDisplayMode) return;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('.participant-row');

    rows.forEach(row => {
        const participantId = parseInt(row.getAttribute('data-participant-id'));
        const participant = participants.find(p => p.id === participantId);

        if (participant.name.toLowerCase().includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Sauvegarde et chargement des données
function saveData() {
    if (isDisplayMode) return;

    try {
        const data = {
            participants: participants,
            nextId: nextId,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem(getStorageKey(), JSON.stringify(data));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde des données');
    }
}

function loadData() {
    try {
        const data = localStorage.getItem(getStorageKey());
        if (data) {
            const parsed = JSON.parse(data);
            participants = parsed.participants || [];
            nextId = parsed.nextId || 1;
            updateRankings();
        } else {
            participants = [];
            nextId = 1;
        }
        loadSettings();
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        participants = [];
        nextId = 1;
    }
}

function saveSettings() {
    if (isDisplayMode) return;

    const settings = {
        currentSort: currentSort,
        sortDirection: sortDirection,
        simpleView: simpleView
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        if (settings) {
            const parsed = JSON.parse(settings);
            currentSort = parsed.currentSort || 'rank';
            sortDirection = parsed.sortDirection || 'asc';
            simpleView = parsed.simpleView || false;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        currentSort = 'rank';
        sortDirection = 'asc';
        simpleView = false;
    }
}

// Import/Export
function exportData() {
    if (isDisplayMode) return;

    const data = {
        participants: participants,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `scorebowl_${currentCategory}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Données exportées');
}

function importData() {
    if (isDisplayMode) return;

    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

function processImport() {
    if (isDisplayMode) return;

    const fileInput = document.getElementById('importFile');
    if (fileInput.files.length > 0) {
        // Le traitement se fait dans l'event listener du input file
        console.log('Import en cours...');
    } else {
        alert('Veuillez sélectionner un fichier');
    }
}

// === NOUVELLES FONCTIONNALITÉS ===

// Vue simplifiée
function toggleSimpleView() {
    if (isDisplayMode) return;

    simpleView = !simpleView;
    updateViewToggleButton();
    updateTableColumns();
    updateDisplay();
    saveSettings();
    showToast(simpleView ? 'Vue simplifiée activée' : 'Vue complète activée');
}

function updateViewToggleButton() {
    const btn = document.getElementById('viewToggleBtn');
    if (simpleView) {
        btn.innerHTML = '<i class="bi bi-eye"></i> Vue complète';
        btn.title = 'Basculer en vue complète';
    } else {
        btn.innerHTML = '<i class="bi bi-eye-slash"></i> Vue simple';
        btn.title = 'Basculer en vue simplifiée';
    }
}

function updateTableColumns() {
    const scoreColumns = document.querySelectorAll('.score-column');
    scoreColumns.forEach(col => {
        col.style.display = simpleView ? 'none' : '';
    });
}

// Assistant d'export
function showExportAssistant() {
    if (isDisplayMode) return;

    const modal = new bootstrap.Modal(document.getElementById('exportAssistantModal'));

    // Mise à jour des informations
    document.getElementById('exportPreviewCount').textContent = participants.length;
    document.getElementById('exportDate').textContent = new Date().toLocaleDateString('fr-FR');

    modal.show();
}

function executeExport() {
    if (isDisplayMode) return;

    const includeStats = document.getElementById('exportWithStats').checked;
    const readableFormat = document.getElementById('exportReadableFormat').checked;

    const data = {
        participants: participants,
        exportDate: new Date().toISOString(),
        version: '1.1',
        category: currentCategory,
        metadata: {
            totalParticipants: participants.length,
            exportedBy: 'ScoreBowl',
            format: readableFormat ? 'readable' : 'compact'
        }
    };

    // Ajouter les statistiques si demandé
    if (includeStats && participants.length > 0) {
        const totals = participants.map(p => p.total);
        data.statistics = {
            bestScore: Math.max(...totals),
            averageScore: totals.reduce((a, b) => a + b, 0) / totals.length,
            worstScore: Math.min(...totals),
            totalScores: totals.reduce((a, b) => a + b, 0)
        };
    }

    const jsonString = readableFormat ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `scorebowl_${currentCategory}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    bootstrap.Modal.getInstance(document.getElementById('exportAssistantModal')).hide();
    showToast('Données exportées avec succès');
}

// Assistant d'import
function showImportAssistant() {
    if (isDisplayMode) return;

    const modal = new bootstrap.Modal(document.getElementById('importAssistantModal'));

    // Mise à jour du compteur actuel
    document.getElementById('currentParticipantsCount').textContent = participants.length;

    // Reset du preview
    document.getElementById('importPreview').style.display = 'none';
    document.getElementById('importAssistantBtn').disabled = true;
    document.getElementById('importAssistantFile').value = '';

    modal.show();

    // Event listener pour le fichier
    const fileInput = document.getElementById('importAssistantFile');
    fileInput.addEventListener('change', handleImportFileSelect);
}

function handleImportFileSelect(event) {
    if (isDisplayMode) return;

    const file = event.target.files[0];
    const previewDiv = document.getElementById('importPreview');
    const importBtn = document.getElementById('importAssistantBtn');

    if (!file) {
        previewDiv.style.display = 'none';
        importBtn.disabled = true;
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.participants && Array.isArray(data.participants)) {
                document.getElementById('importParticipantsCount').textContent = data.participants.length;
                previewDiv.style.display = 'block';
                importBtn.disabled = false;

                // Stocker les données pour l'import
                window.pendingImportData = data;
            } else {
                throw new Error('Format invalide');
            }
        } catch (error) {
            alert('Fichier JSON invalide ou format non reconnu');
            previewDiv.style.display = 'none';
            importBtn.disabled = true;
        }
    };
    reader.readAsText(file);
}

function executeImport() {
    if (isDisplayMode) return;

    if (!window.pendingImportData) {
        alert('Aucune donnée à importer');
        return;
    }

    const mode = document.querySelector('input[name="importMode"]:checked').value;
    const data = window.pendingImportData;

    if (mode === 'replace') {
        // Remplacer toutes les données
        participants = data.participants.map(p => ({
            ...p,
            id: nextId++
        }));
    } else if (mode === 'merge') {
        // Fusionner avec les données existantes
        const newParticipants = data.participants.map(p => ({
            ...p,
            id: nextId++
        }));
        participants = [...participants, ...newParticipants];
    }

    updateRankings();
    updateDisplay();
    saveData();

    bootstrap.Modal.getInstance(document.getElementById('importAssistantModal')).hide();
    showToast(`Import réussi: ${data.participants.length} participant(s) ${mode === 'replace' ? 'importé(s)' : 'ajouté(s)'}`);

    // Nettoyer
    delete window.pendingImportData;
}

// Confirmation de suppression
function showClearConfirmation() {
    if (isDisplayMode) return;

    const modal = new bootstrap.Modal(document.getElementById('clearConfirmationModal'));

    // Mise à jour du nombre de participants
    document.getElementById('clearParticipantsCount').textContent = participants.length;

    // Reset checkbox et bouton
    document.getElementById('clearConfirmCheck').checked = false;
    document.getElementById('clearConfirmBtn').disabled = true;

    // Event listener pour la checkbox
    document.getElementById('clearConfirmCheck').addEventListener('change', function () {
        document.getElementById('clearConfirmBtn').disabled = !this.checked;
    });

    modal.show();
}

function executeClear() {
    if (isDisplayMode) return;

    participants = [];
    nextId = 1;

    updateDisplay();
    updateViewToggleButton();
    updateTableColumns();
    saveData();
    saveSettings();

    // Réinitialiser les boutons de tri
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('sortRankBtn').classList.add('active');
    updateSortButtons();

    bootstrap.Modal.getInstance(document.getElementById('clearConfirmationModal')).hide();
    showToast('Toutes les données ont été supprimées');
}

function showDeleteConfirmation(participant) {
    if (isDisplayMode) return;

    if (confirm(`Supprimer ${participant.name} ?\n\nCette action supprimera définitivement ce participant et tous ses scores.`)) {
        participants = participants.filter(p => p.id !== participant.id);
        updateRankings();
        updateDisplay();
        saveData();
        showToast('Participant supprimé');
    }
}

// Utilitaires
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    if (isDisplayMode) {
        console.log(message);
        return;
    }

    const toastElement = document.getElementById('saveToast');
    if (!toastElement) {
        console.log(message);
        return;
    }

    const toastBody = toastElement.querySelector('.toast-body');
    if (toastBody) {
        toastBody.textContent = message;
    }

    if (window.bootstrap && typeof bootstrap.Toast === 'function') {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } else {
        console.log(message);
    }
}

function safePrompt(message, defaultValue) {
    try {
        if (typeof window.prompt === 'function') {
            return window.prompt(message, defaultValue);
        }
    } catch (error) {
        console.warn('Prompt indisponible, valeur par defaut utilisee.', error);
    }

    return defaultValue;
}

function initializeMode() {
    if (!isDisplayMode) {
        return;
    }

    document.body.classList.add('display-mode');
    document.body.classList.add(`category-${currentCategory}`);
    document.title = `ScoreBowl - Classement ${getCategoryLabel(currentCategory)}`;

    const eyebrow = document.getElementById('displayEyebrow');
    if (eyebrow) {
        eyebrow.textContent = `Classement ${getCategoryLabel(currentCategory)}`;
    }

    startDisplayAutoRefresh();

    displayResizeHandler = () => {
        restartDisplayAutoScroll();
    };
    globalThis.addEventListener('resize', displayResizeHandler);
}

function updateDisplayScreen() {
    const totalElement = document.getElementById('displayTotalParticipants');
    const bestElement = document.getElementById('displayBestScore');
    const listElement = document.getElementById('displayParticipantsList');

    if (!totalElement || !bestElement || !listElement) {
        return;
    }

    totalElement.textContent = participants.length;
    bestElement.textContent = participants.length > 0
        ? Math.max(...participants.map((participant) => participant.total))
        : '-';

    const sortedParticipants = getDisplaySortedParticipants();
    displayDataFingerprint = getDisplayDataFingerprint(sortedParticipants);

    if (participants.length === 0) {
        listElement.innerHTML = '<div class="display-screen__empty">Le classement apparaîtra ici dès que vous ajouterez des participants.</div>';
        stopDisplayAutoScroll();
        return;
    }

    renderDisplayRows(sortedParticipants);

    restartDisplayAutoScroll();
}

function startDisplayAutoRefresh() {
    stopDisplayAutoRefresh();
    displayRefreshInterval = setInterval(() => {
        refreshDisplayData();
    }, 1000);

    globalThis.addEventListener('storage', refreshDisplayData);
}

function stopDisplayAutoRefresh() {
    if (displayRefreshInterval) {
        clearInterval(displayRefreshInterval);
        displayRefreshInterval = null;
    }

    if (displayResizeHandler) {
        globalThis.removeEventListener('resize', displayResizeHandler);
        displayResizeHandler = null;
    }
}

function refreshDisplayData() {
    loadData();
    const nextFingerprint = getDisplayDataFingerprint(getDisplaySortedParticipants());
    if (nextFingerprint !== displayDataFingerprint) {
        updateDisplayScreen();
    }
}

function getDisplaySortedParticipants() {
    // L'ecran de classement reste toujours trie par score (rang),
    // quel que soit le tri choisi dans l'ecran de saisie.
    return [...participants].sort((a, b) => {
        if (a.rank !== b.rank) {
            return a.rank - b.rank;
        }
        if (b.total !== a.total) {
            return b.total - a.total;
        }
        return a.name.localeCompare(b.name, 'fr');
    });
}

function restartDisplayAutoScroll() {
    stopDisplayAutoScroll();

    const viewport = document.getElementById('displayViewport');
    const list = document.getElementById('displayParticipantsList');
    if (!viewport || !list) {
        return;
    }

    const startWhenReady = (attempt = 0) => {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        if (maxScroll <= 2) {
            if (attempt < 15) {
                displayScrollStartTimeout = setTimeout(() => startWhenReady(attempt + 1), 200);
            }
            return;
        }

        viewport.scrollTop = 0;
        let pauseTicks = 50; // pause initiale en haut (~1.5s)
        let reachedBottom = false;

        displayScrollInterval = setInterval(() => {
            const dynamicMax = viewport.scrollHeight - viewport.clientHeight;
            if (dynamicMax <= 2) {
                viewport.scrollTop = 0;
                return;
            }

            if (pauseTicks > 0) {
                pauseTicks -= 1;
                if (pauseTicks === 0 && reachedBottom) {
                    // fin de pause en bas → retour en haut
                    viewport.scrollTop = 0;
                    reachedBottom = false;
                    pauseTicks = 50; // pause en haut avant de redéfiler
                }
                return;
            }

            const next = viewport.scrollTop + 3;
            if (next >= dynamicMax) {
                viewport.scrollTop = dynamicMax;
                reachedBottom = true;
                pauseTicks = 70; // ~2s de pause en bas
                return;
            }

            viewport.scrollTop = next;
        }, 30);
    };

    startWhenReady();
}

function stopDisplayAutoScroll() {
    if (displayScrollStartTimeout) {
        clearTimeout(displayScrollStartTimeout);
        displayScrollStartTimeout = null;
    }

    if (displayScrollInterval) {
        clearInterval(displayScrollInterval);
        displayScrollInterval = null;
    }
}

function renderDisplayRows(rows) {
    const listElement = document.getElementById('displayParticipantsList');
    if (!listElement) {
        return;
    }

    if (rows.length === 0) {
        listElement.innerHTML = '<div class="display-screen__empty">Le classement apparaîtra ici dès que vous ajouterez des participants.</div>';
        return;
    }

    listElement.innerHTML = rows
        .map((participant) => {
            const rowClass = participant.rank <= 3 ? 'display-screen__row display-screen__row--podium' : 'display-screen__row';
            const rankClass = participant.rank <= 3 ? `display-screen__rank display-screen__rank--${participant.rank}` : 'display-screen__rank display-screen__rank--other';
            return `
                <div class="${rowClass}">
                    <span class="${rankClass}">${participant.rank}</span>
                    <span class="display-screen__name">${escapeHtml(participant.name)}</span>
                    <span class="display-screen__score">${participant.score1}</span>
                    <span class="display-screen__score">${participant.score2}</span>
                    <span class="display-screen__score">${participant.score3}</span>
                    <span class="display-screen__total">${participant.total}</span>
                </div>
            `;
        })
        .join('');
}

function getDisplayDataFingerprint(participantList) {
    return JSON.stringify(
        participantList.map((participant) => ({
            id: participant.id,
            name: participant.name,
            score1: participant.score1,
            score2: participant.score2,
            score3: participant.score3,
            total: participant.total,
            rank: participant.rank
        }))
    );
}

function openDisplayScreen(category) {
    const cat = category || currentCategory;
    const displayUrl = new URL(`${globalThis.location.pathname}?mode=display&category=${cat}`, globalThis.location.href).toString();
    globalThis.open(displayUrl, `scorebowl-display-${cat}`);
}

// Édition rapide des scores
function openQuickEdit(id) {
    if (isDisplayMode) return;

    const participant = participants.find(p => p.id === id);
    if (!participant) return;

    document.getElementById('quickEditId').value = id;
    document.getElementById('quickEditName').innerHTML = `<i class="bi bi-pencil-square"></i> ${escapeHtml(participant.name)}`;
    document.getElementById('quickEditScore1').value = participant.score1;
    document.getElementById('quickEditScore2').value = participant.score2;
    document.getElementById('quickEditScore3').value = participant.score3;
    updateQuickEditTotal();

    // Mettre à jour le total en temps réel
    ['quickEditScore1', 'quickEditScore2', 'quickEditScore3'].forEach(inputId => {
        const el = document.getElementById(inputId);
        el.oninput = updateQuickEditTotal;
    });

    const modal = new bootstrap.Modal(document.getElementById('quickEditModal'));
    modal.show();

    // Focus sur Score 1
    document.getElementById('quickEditModal').addEventListener('shown.bs.modal', function handler() {
        document.getElementById('quickEditScore1').focus();
        document.getElementById('quickEditScore1').select();
        document.getElementById('quickEditModal').removeEventListener('shown.bs.modal', handler);
    });
}

function updateQuickEditTotal() {
    const s1 = parseInt(document.getElementById('quickEditScore1').value) || 0;
    const s2 = parseInt(document.getElementById('quickEditScore2').value) || 0;
    const s3 = parseInt(document.getElementById('quickEditScore3').value) || 0;
    document.getElementById('quickEditTotal').textContent = `Total : ${s1 + s2 + s3}`;
}

function saveQuickEdit() {
    if (isDisplayMode) return;

    const id = parseInt(document.getElementById('quickEditId').value);
    const participant = participants.find(p => p.id === id);
    if (!participant) return;

    participant.score1 = Math.max(0, parseInt(document.getElementById('quickEditScore1').value) || 0);
    participant.score2 = Math.max(0, parseInt(document.getElementById('quickEditScore2').value) || 0);
    participant.score3 = Math.max(0, parseInt(document.getElementById('quickEditScore3').value) || 0);
    participant.total = participant.score1 + participant.score2 + participant.score3;

    updateRankings();
    updateDisplay();
    saveData();

    bootstrap.Modal.getInstance(document.getElementById('quickEditModal')).hide();
    showToast(`Scores de "${participant.name}" mis à jour`);
}

// Gestion des catégories
function switchCategory(category) {
    if (isDisplayMode) return;
    if (category === currentCategory) return;

    currentCategory = category;
    localStorage.setItem(CATEGORY_KEY, category);
    loadData();
    updateDisplay();
    updateCategoryButtons();
    showToast(category === 'adults' ? 'Catégorie Adultes' : 'Catégorie Enfants');
}

function updateCategoryButtons() {
    const adultsBtn = document.getElementById('categoryAdultsBtn');
    const childrenBtn = document.getElementById('categoryChildrenBtn');
    if (!adultsBtn || !childrenBtn) return;

    if (currentCategory === 'adults') {
        adultsBtn.className = 'btn btn-light btn-sm active';
        childrenBtn.className = 'btn btn-outline-light btn-sm';
    } else {
        adultsBtn.className = 'btn btn-outline-light btn-sm';
        childrenBtn.className = 'btn btn-light btn-sm active';
    }

    // Mettre à jour la classe de catégorie sur le body
    document.body.classList.remove('category-adults', 'category-children');
    document.body.classList.add(`category-${currentCategory}`);

    const tableTitle = document.getElementById('tableTitle');
    if (tableTitle) {
        const label = getCategoryLabel(currentCategory);
        tableTitle.innerHTML = `<i class="bi bi-list-ol"></i> Classement - ${label}`;
    }
}

function migrateOldData() {
    // Migrer les anciennes données (scorebowl_participants) vers le format catégorie
    const oldData = localStorage.getItem('scorebowl_participants');
    if (oldData && !localStorage.getItem('scorebowl_participants_adults')) {
        localStorage.setItem('scorebowl_participants_adults', oldData);
        localStorage.removeItem('scorebowl_participants');
        console.log('Données migrées vers la catégorie Adultes');
    }
}

function getCategoryLabel(category) {
    return category === 'children' ? 'Enfants' : 'Adultes';
}

// Gestion des erreurs globales
globalThis.addEventListener('error', function (e) {
    console.error('Erreur JavaScript:', e.error);
});

// Sauvegarde automatique périodique
if (!isDisplayMode) {
    setInterval(saveData, 30000); // Sauvegarde toutes les 30 secondes
}

// Export des fonctions globales pour les boutons HTML
globalThis.addParticipant = addParticipant;
globalThis.deleteParticipant = deleteParticipant;
globalThis.duplicateParticipant = duplicateParticipant;
globalThis.resetParticipantScores = resetParticipantScores;
globalThis.clearAllData = clearAllData;
globalThis.sortBy = sortBy;
globalThis.filterParticipants = filterParticipants;
globalThis.exportData = exportData;
globalThis.importData = importData;
globalThis.processImport = processImport;

// Nouvelles fonctions
globalThis.toggleSimpleView = toggleSimpleView;
globalThis.showExportAssistant = showExportAssistant;
globalThis.executeExport = executeExport;
globalThis.showImportAssistant = showImportAssistant;
globalThis.executeImport = executeImport;
globalThis.showClearConfirmation = showClearConfirmation;
globalThis.executeClear = executeClear;
globalThis.openDisplayScreen = openDisplayScreen;
globalThis.switchCategory = switchCategory;
globalThis.openQuickEdit = openQuickEdit;
globalThis.saveQuickEdit = saveQuickEdit;
