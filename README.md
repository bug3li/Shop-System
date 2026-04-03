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

⚖️ Dependencies
ChestFormData: Required for the custom chest-style UI layout.

Database: Used for tracking menu history (back buttons).

Scoreboard Utilities: Required for getScore and setScore functionality.
