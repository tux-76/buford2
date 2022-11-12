export function factor(integer, doPairs=false, negativeDomain=false) {
    let factors = [];
    for (let i = (negativeDomain ? Math.abs(integer)*-1 : 0); i <= Math.abs(integer); i++) {
        if (integer % i === 0) factors.push(doPairs ? [i, integer/i] : i);
    }
    return factors;
}

export function gcf(int1, int2) {
    let factors1 = factor(int1);
    let factors2 = factor(int2);
    let greatestCF = 1;
    factors1.forEach(fac => {
        if (factors2.includes(fac)) greatestCF = fac;
    });
    return greatestCF;
}

// export function lcd(num1, num2) {

// }

export function isPrime(integer) {
    let factors = factor(integer);
    return (factors.length === 2);
}

export function primeFactor(integer) {
    let workingInt = Math.abs(integer);
    let primeFactors = (integer >= 0) ? [] : [-1];

    while (!isPrime(workingInt) && workingInt > 1) {
        primeFactors.push(factor(workingInt)[1]);
        workingInt /= primeFactors[primeFactors.length-1];
    }

    primeFactors.push(workingInt);
    return primeFactors
}