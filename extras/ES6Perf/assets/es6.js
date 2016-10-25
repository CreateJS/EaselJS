class ES6Simple {
    constructor() {}
    superChained() {}
    superGrantParent() {}
    inherit() {}
}

class ES6Mid extends ES6Simple {
    constructor() {
        super();
    }
    superChained() {
        super.superChained();
    }
}

class ES6Extended extends ES6Mid {
    constructor() {
        super();
    }
    superChained() {
        super.superChained();
    }
    superGrandParent() {
        super.superGrantParent();
    }
    extend() {}
}
