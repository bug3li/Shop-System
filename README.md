<img width="1920" height="1032" alt="Screenshot 2026-04-18 002742" src="https://github.com/user-attachments/assets/abe0902e-b82a-4726-b0b0-94cafd43365d" />
<img width="1920" height="1032" alt="Screenshot 2026-04-18 002727" src="https://github.com/user-attachments/assets/30be0336-474f-496a-9ed4-181e63e0f0e1" />
<img width="1920" height="1032" alt="Screenshot 2026-04-18 002655" src="https://github.com/user-attachments/assets/f5dc8ba3-02ab-4c1a-baf6-e5ee281ae08d" />
A high-performance, modular Shop Manager for Minecraft Bedrock Edition. This system leverages the @minecraft/server API to provide a professional GUI experience using ChestFormData, supporting multiple currencies, nested sub-menus, and automated item enchantment.

🚀 Features
Pattern-Based UI: Design your shop layout using a simple string grid (e.g., xxxxxxxxx).

Multi-Currency Support: Set a global currency (e.g., dollars) or override it per item (e.g., shards).

Nested Menus: Easily create sub-categories (PVP Shop, Food Shop, etc.) using callback_shop.

Auto-Enchanting: Define enchantments directly in the JSON object to be applied upon purchase.

Smart Validation: Automatically calculates max stack sizes and checks for valid typeId before processing.

Navigation History: Built-in "Back" button logic that remembers which menu the player came from.

🛠️ Installation

Import ShopManager into your main script file.

Ensure your manifest.json includes the @minecraft/server module.
