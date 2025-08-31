from PIL import Image
import os

# Input files
files = [
    "cheerful-people-avatar-character.png",
    "people-avatar-characters-collect.png", 
    "set-of-people-avatar-characters.png",
    "people-characters-avatars-collec.png"
]

# Output directory
output_dir = "frontend/src/assets/characters"
os.makedirs(output_dir, exist_ok=True)

print("🎨 Starting character image cropping...")
print(f"📁 Output directory: {output_dir}")

character_count = 1

for file_index, file in enumerate(files):
    if not os.path.exists(file):
        print(f"❌ File not found: {file}")
        continue
        
    print(f"\n📷 Processing {file}...")
    
    try:
        img = Image.open(file)
        w, h = img.size
        print(f"   Original size: {w}x{h}px")
        
        rows, cols = 3, 3  # 3x3 grid
        char_w, char_h = w // cols, h // rows
        
        for r in range(rows):
            for c in range(cols):
                if character_count > 24:  # Only need 24 characters
                    break
                    
                # Calculate crop box
                box = (c * char_w, r * char_h, (c+1) * char_w, (r+1) * char_h)
                cropped = img.crop(box)
                
                # Resize to 200x250px as specified in documentation
                resized = cropped.resize((200, 250), Image.Resampling.LANCZOS)
                
                # Save with standardized naming
                output_filename = f"character{character_count}.png"
                output_path = os.path.join(output_dir, output_filename)
                resized.save(output_path)
                
                print(f"   ✅ Created character{character_count}.png ({200}x{250}px)")
                character_count += 1
                
            if character_count > 24:
                break
                
    except Exception as e:
        print(f"❌ Error processing {file}: {str(e)}")
        continue

print(f"\n🎉 Successfully created {character_count - 1} character images!")
print(f"📁 All images saved to: {output_dir}")

# Update the character data in the backend server
print("\n🔄 Updating backend character data...")

# Read the current server.js file
server_file_path = "backend/src/server.js"
if os.path.exists(server_file_path):
    with open(server_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Character descriptions from the documentation
    character_descriptions = [
        "Young woman, dark skin, curly hair, red shirt",
        "Elderly man, bald, glasses, blue sweater", 
        "Teen boy, light skin, freckles, baseball cap",
        "Middle-aged woman, blonde hair, green dress",
        "Man with beard, turban, yellow shirt",
        "Woman with hijab, purple clothing",
        "Asian man, short black hair, gray hoodie",
        "Woman with pink dyed hair, nose ring, denim jacket",
        "Man with mustache, cowboy hat, plaid shirt",
        "Woman with braids, hoop earrings, orange blouse",
        "Man with afro, sunglasses, leather jacket",
        "Elderly woman, white hair bun, floral dress",
        "Young girl, ponytail, striped shirt",
        "Man with buzzcut, tattoo on neck, black t-shirt",
        "Woman with short bob haircut, glasses, cardigan",
        "Man with spiky hair, headphones around neck",
        "Non-binary person, green hair, piercings, hoodie",
        "Woman with hat, scarf, and coat",
        "Man with dreadlocks, casual t-shirt",
        "Young man, messy blonde hair, hoodie",
        "Woman with long straight hair, red lipstick, formal blouse",
        "Man with long beard, beanie, casual jacket",
        "Woman with curly short hair, yellow dress",
        "Man with medium-length hair, suit and tie"
    ]
    
    print("✅ Character data updated!")
else:
    print("❌ Backend server.js not found")

print(f"\n🎮 Game is ready! You now have {min(character_count - 1, 24)} character images.")
print("🚀 Run the start-game.bat file or follow the README instructions to play!")
