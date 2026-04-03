import { world } from "@minecraft/server";

export function getScore(player, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(player) ?? 0;
    } catch (error) {
        return 0;
    }
}

export function addScore(player, objective, amount) {
    try {
        return world.scoreboard.getObjective(objective).addScore(player, amount);
    } catch (error) {
        return 0;
    }
}

export function setScore(player, objective, amount) {
    try {
        return world.scoreboard.getObjective(objective).setScore(player, amount);
    } catch (error) {
        return 0;
    }
}

export function removeScore(player, objective, amount) {
    try {
        const value = world.scoreboard.getObjective(objective).getScore(player);
        return world.scoreboard.getObjective(objective).setScore(player, value - amount);
    } catch (error) {
        return 0;
    }
}