"use strict";

class Flags {
    // what makes this data unique
    // eventually, these will have to be
    // tailored to implementation types
    // but, right now, everything's arrays

    constructor(inFlags) {
        // buttons
        this.isCollapsible = 0;
        this.isShowJustOne = 0;
        this.isSequential = 0;
        this.isSilent = 0;
        this.hasGenericFeedback = 0;

        // lists
        this.isList = 0;
        this.isAlwaysOpen = 0;
        this.hasAdd = 0;
        this.hasAddGroup = 0;
        this.hasPlusMinus = 0;
        this.hasUpDownMove = 0;
        this.hasTinkBox = 0;

        // sched
        this.hasDetails = 0;
        this.hasNoTime = 0;

        // groups
        this.writeGroup = 0;

        this.isRandomized = 0;

        if (inFlags.indexOf('c') >= 0)
            this.isCollapsible = 1;
        if (inFlags.indexOf('j') >= 0)
            this.isShowJustOne = 1;
        if (inFlags.indexOf('q') >= 0)
            this.isSequential = 1;
        if (inFlags.indexOf('s') >= 0)
            this.isSilent = 1;
        if (inFlags.indexOf('f') >= 0)
            this.hasFeedback = 1;

        if (inFlags.indexOf('l') >= 0)
            this.isList = 1;
        if (inFlags.indexOf('o') >= 0)
            this.isAlwaysOpen = 1;
        if (inFlags.indexOf('a') >= 0)
            this.hasAdd = 1;
        if (inFlags.indexOf('g') >= 0)
            this.hasAddGroup = 1;
        if (inFlags.indexOf('p') >= 0)
            this.hasPlusMinus = 1;
        if (inFlags.indexOf('u') >= 0)
            this.hasUpDownMove = 1;
        if (inFlags.indexOf('t') >= 0)
            this.hasTinkBox = 1;

        if (inFlags.indexOf('d') >= 0)
            this.hasDetails = 1;
        if (inFlags.indexOf('n') >= 0)
            this.hasNoTime = 1;

        if (inFlags.indexOf('r') >= 0)
            this.isRandomized = 1;
        if (inFlags.indexOf('m') >= 0)
            this.hasRandomMemory = 1;

        if (inFlags.indexOf('w') >= 0)
            this.writeGroup = 1;
    }

}