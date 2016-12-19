"use strict";

/***************
    Contents
****************
****************
** Interface-Checking
** Data Structure
** Populate Data
** Write HTML
** Transform Arrays
** Using LocalStorage
** Cleanup
** Testing
****************/

/*********************
**********************
  Interface-Checking
**********************
**********************/

class Interfac {

    constructor(name, members) {
        if (arguments.length != 2) {
            throw new Error("Interface constructor called with "
                + arguments.length + " arguments, but expected exactly 2.");
        }

        this.name = name;
        this.members = [];

        for (var i = 0, len = members.length; i < len; i++) {
            if (typeof members[i] !== 'string') {
                throw new Error("Interfac expects member names to be passed in as a string.");
            }

            this.members.push(members[i]);
        }
    } // end constructor

    static ensureImplements(object) {
        if (arguments.length < 2) {
            throw new Error("Function Interfac.ensureImplements called with "
                + arguments.length + " arguments, but expected at least 2.");
        }

        for (var i = 1, len = arguments.length; i < len; i++) {
            var interfac = arguments[i];
            if (interfac.constructor !== Interfac) {
                throw new Error("Function Interfac.ensureImplements expects arguments two and above to be instances of Interface.");
            }

            for (var j = 0, membersLen = interfac.members.length; j < membersLen; j++) {
                var member = interfac.members[j];
                if (!(member in object)) // could check specifically for functions: || typeof object[method] !== 'function'
                    throw new Error("Function Interfac.ensureImplements: object does not implement the " + interfac.name + " interface. Member " + method + " was not found.");
            }
        }

    } // end static ensureImplements(...)
}

/*********************
**********************
 Available Interfaces
**********************
**********************/

var MyList = new Interfac("MyList", ['_label', '_archived', '_arrOrder']);