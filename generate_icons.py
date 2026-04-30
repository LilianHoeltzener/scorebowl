#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Générateur d'icônes PNG pour ScoreBowl
Crée des icônes de différentes tailles avec un design simple
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size=192, bg_color='#0d6efd', trophy_color='#FFD700'):
    """Crée une icône PNG de la taille spécifiée"""
    # Créer une nouvelle image avec fond transparent
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Fond avec coins arrondis (bleu)
    radius = size // 10
    bg_color_rgb = tuple(int(bg_color.replace('#', '')[i:i+2], 16) for i in (0, 2, 4))
    
    # Dessiner le fond avec coins arrondis
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=bg_color_rgb + (255,))
    
    # Dimensions du trophée
    center_x, center_y = size // 2, size // 2
    trophy_width = size // 3
    trophy_height = size // 2
    
    # Couleur du trophée
    trophy_color_rgb = tuple(int(trophy_color.replace('#', '')[i:i+2], 16) for i in (0, 2, 4))
    
    # Dessiner le trophée (forme simplifiée)
    # Coupe principale
    cup_top = center_y - trophy_height // 3
    cup_bottom = center_y + trophy_height // 6
    cup_left = center_x - trophy_width // 2
    cup_right = center_x + trophy_width // 2
    
    draw.ellipse([cup_left, cup_top, cup_right, cup_bottom], fill=trophy_color_rgb + (255,))
    
    # Base du trophée
    base_width = trophy_width // 2
    base_height = size // 15
    base_left = center_x - base_width // 2
    base_right = center_x + base_width // 2
    base_top = cup_bottom
    base_bottom = base_top + base_height
    
    draw.rectangle([base_left, base_top, base_right, base_bottom], fill=trophy_color_rgb + (255,))
    
    # Socle
    socle_width = trophy_width // 3
    socle_height = size // 20
    socle_left = center_x - socle_width // 2
    socle_right = center_x + socle_width // 2
    socle_top = base_bottom
    socle_bottom = socle_top + socle_height
    
    draw.rectangle([socle_left, socle_top, socle_right, socle_bottom], fill=trophy_color_rgb + (255,))
    
    # Poignées (optionnel pour les grandes tailles)
    if size >= 128:
        handle_radius = size // 25
        left_handle_x = cup_left - handle_radius
        right_handle_x = cup_right + handle_radius
        handle_y = center_y - trophy_height // 6
        
        # Poignées en forme d'arc (approximation avec des cercles)
        draw.ellipse([left_handle_x - handle_radius, handle_y - handle_radius, 
                     left_handle_x + handle_radius, handle_y + handle_radius], 
                     outline=trophy_color_rgb + (255,), width=2)
        draw.ellipse([right_handle_x - handle_radius, handle_y - handle_radius, 
                     right_handle_x + handle_radius, handle_y + handle_radius], 
                     outline=trophy_color_rgb + (255,), width=2)
    
    return img

def main():
    """Fonction principale - génère toutes les icônes"""
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # Créer le dossier icons s'il n'existe pas
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        icon = create_icon(size)
        filename = f'icons/icon-{size}x{size}.png'
        icon.save(filename)
        print(f'Icône créée: {filename}')
    
    print('Toutes les icônes ont été générées avec succès!')

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print("Erreur: Pillow n'est pas installé. Installez-le avec:")
        print("pip install Pillow")
        print("\nAlternativement, ouvrez icon-generator.html dans votre navigateur")
        print("pour générer les icônes manuellement.")
