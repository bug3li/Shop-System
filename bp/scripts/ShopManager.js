import { ItemStack, EnchantmentTypes, ItemTypes } from "@minecraft/server";
import { ChestFormData } from "./util/extensions/forms.js";
import { toRoman } from "./util/toRoman.js";
import { Database } from "./util/cooldatabase.js";
import { getScore, setScore } from "./util/scoreboard.js";
import { capitalize } from "./util/capitalize.js";
import { getAttackDamage } from "./util/getAttackDamage.js";

export class ShopManager {
    constructor() {
        this.defaultObjective = "dollars";
    }

    open(player, shopData) {
        const ui = new ChestFormData("small");
        ui.title(shopData.name);

        const items = shopData.items;

        items.forEach((item, i) => {
            const objective = item?.objective ?? shopData?.objective ?? this.defaultObjective;
            const coststr = item?.cost ? `\n§2${item.cost} ${objective}` : "";
            const typeId = item?.item?.typeId ?? item.typeId;

            let description = [];
            let enchanted = item.enchanted ?? false;

            if (item.enchantments) {
                item.enchantments.forEach((enc) => {
                    description.push(`§7${capitalize(enc.type)} ${toRoman(enc.level)}`);
                    enchanted = true;
                });
            }

            if (!item?.chest_location) {
                if (ItemTypes.get(typeId) !== undefined) {
                    const stack = new ItemStack(typeId, 1);
                    const damage = getAttackDamage(stack);
                    if (damage !== 0) description.push(`\n§9+${damage} Attack Damage`);
                }
            }

            let slot = shopData.manual_slot_override ? item.slot : i + (shopData.starting_slot ?? 0);
            ui.button(slot, `${item.name}${coststr}`, description, typeId, item.item?.amount ?? 1, 0, enchanted);
        });

        ui.pattern(shopData.pattern.lines, shopData.pattern.keys);

        ui.show(player).then((data) => {
            if (data.canceled) return;

            let selected = shopData.manual_slot_override
                ? items.find((s) => s.slot === data.selection)
                : items[data.selection - (shopData.starting_slot ?? 0)];

            if (!selected) return;
            this.handleSelection(player, shopData, selected);
        });
    }

    handleSelection(player, currentShop, selected) {
        let history = Database.get("previous_menu", player) || [""];

        if (selected.back_button) {
            const previous = history.pop();
            Database.set("previous_menu", history, player);
            if (previous) this.open(player, previous);
            return;
        }

        if (selected.callback_shop) {
            history.push(currentShop);
            Database.set("previous_menu", history, player);
            this.open(player, selected.callback_shop);
            return;
        }

        const maxStack = ItemTypes.get(selected.typeId) ? new ItemStack(selected.typeId, 1).maxAmount : 64;
        const purchaseContext = {
            ...selected,
            maxStackSize: maxStack,
            objective: selected.objective ?? currentShop.objective ?? this.defaultObjective,
        };

        history.push(currentShop);
        Database.set("previous_menu", history, player);
        this.openAmountSelector(player, purchaseContext, 1);
    }

    openAmountSelector(player, selected, amount) {
        const cost = selected.cost * amount;
        const ui = new ChestFormData("small");
        let name = selected.name.replace(/§./g, "");

        ui.title(`§2Buy §8${amount} §2${name}`);

        let desc = (selected.enchantments ?? []).map((e) => `§7${capitalize(e.type)} ${toRoman(e.level)}`);

        ui.button(13, `§8${amount} §2${selected.name}\n§a${cost} ${selected.objective}`, desc, selected.typeId);
        ui.button(11, "§2+§a1", [], "minecraft:green_wool");
        ui.button(10, "§2+§a10", [], "minecraft:green_wool");
        ui.button(15, "§4-§c1", [], "minecraft:red_wool");
        ui.button(16, "§4-§c10", [], "minecraft:red_wool");
        ui.button(18, "§cBack", [], "textures/blocks/glass_red");
        ui.button(26, "§aConfirm", [], "textures/blocks/glass_green");

        ui.pattern(["xxxxxxxxx", "x_______x", "_xxxxxxx_"], {
            x: { itemName: "§cGhostBy SMP", texture: "textures/blocks/glass_black" },
        });

        ui.show(player).then((data) => {
            if (data.canceled) return;

            switch (data.selection) {
                case 18:
                    const history = Database.get("previous_menu", player);
                    const prev = history.pop();
                    Database.set("previous_menu", history, player);
                    this.open(player, prev);
                    break;
                case 11:
                    this.openAmountSelector(player, selected, Math.min(amount + 1, selected.maxStackSize));
                    break;
                case 10:
                    this.openAmountSelector(player, selected, Math.min(amount + 10, selected.maxStackSize));
                    break;
                case 15:
                    this.openAmountSelector(player, selected, Math.max(amount - 1, 1));
                    break;
                case 16:
                    this.openAmountSelector(player, selected, Math.max(amount - 10, 1));
                    break;
                case 26:
                    this.processPurchase(player, selected, amount, cost);
                    break;
                default:
                    this.openAmountSelector(player, selected, amount);
            }
        });
    }

    processPurchase(player, selected, amount, cost) {
        const inv = player.getComponent("inventory").container;
        const money = getScore(player, selected.objective);

        if (money < cost) return player.sendMessage(`§cNot enough ${selected.objective}`);
        if (inv.emptySlotsCount < 1) return player.sendMessage(`§cInventory full!`);

        setScore(player, selected.objective, money - cost);
        const item = new ItemStack(selected.typeId, amount);

        if (selected.enchantments) {
            const enchantable = item.getComponent("minecraft:enchantable");
            if (enchantable) {
                enchantable.addEnchantments(selected.enchantments.map(e => ({
                    type: EnchantmentTypes.get(e.type),
                    level: e.level
                })));
            }
        }

        inv.addItem(item);
        player.sendMessage(`§aPurchased ${amount}x ${selected.name}`);
        player.playSound("random.orb", { pitch: 1 });
        this.openAmountSelector(player, selected, amount);
    }
}