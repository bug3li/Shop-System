import { world } from "@minecraft/server";
import { ShopManager } from "./ShopManager";

const master_shop_example = {
    name: "§uMaster Shop", // The title displayed at the top of the UI
    manual_slot_override: true, // If true, items use their 'slot' property. If false, they fill in order from //starting_slot: //eg. 9
    objective: "dollars", // The global scoreboard objective used for prices in this shop
    pattern: {
        // Defines the visual layout of the 3x9 (27 slot) chest
        lines: [
            "xxxxxxxxx", // Top Row (Slots 0-8)
            "x_______x", // Middle Row (Slots 9-17)
            "xxxxxxxxx"  // Bottom Row (Slots 18-26)
        ],
        keys: {
            // 'x' fills the slots defined in 'lines' with background items
            x: { 
                itemName: " ", 
                texture: "textures/blocks/glass_black" 
            }
        }
    },
    items: [
        {
            name: "§bEnchanted Sword",
            typeId: "minecraft:diamond_sword", // The item given to the player
            cost: 5000,
            slot: 10, // Specifically places the item in slot 10 because override is true
            enchantments: [
                // Automatically applied to the item upon purchase
                { type: "sharpness", level: 5 },
                { type: "unbreaking", level: 3 }
            ]
        },
        {
            name: "§eShard Exchange",
            typeId: "minecraft:amethyst_shard",
            cost: 10,
            slot: 11,
            // Overrides the shop's global objective. This item costs 'shards' instead of 'dollars'.
            objective: "shards" 
        },
        {
            name: "§aSub-Menu",
            typeId: "minecraft:chest",
            slot: 13,
            // Instead of buying an item, clicking this opens another shop object
            callback_shop: { 
                name: "§7Nested Menu",
                items: [
                    { 
                        name: "§cReturn", 
                        typeId: "minecraft:barrier", 
                        slot: 0, 
                        back_button: true // Closes this menu and re-opens the previous one in history
                    }
                ],
                pattern: { lines: ["_________"], keys: {} }
            }
        },
        {
            name: "§cClose",
            typeId: "textures/blocks/glass_red",
            slot: 16,
            back_button: true // In the main menu, this simply exits the UI
        }
    ]
};

// Initialize the manager
const Shop = new ShopManager();

// Example trigger: Right-click with a piece of Dirt to open the shop
world.afterEvents.itemUse.subscribe((data) => {
    const source = data.source; // The player who used the item
    const itemStack = data.itemStack;

    // Filter to ensure only the specific item triggers the shop
    if (itemStack.typeId !== "minecraft:dirt") return;

    // Opens the UI for the player using the item defined above
    Shop.open(source, master_shop_example);
});