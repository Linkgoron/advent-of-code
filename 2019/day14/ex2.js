require('fs').readFile('./ex.input', (err, data) => {
    if (err) throw new Error("data :(");
    const rules = data.toString().split('\n').map(x => x.trim()).map(x => x.split(' => '))
        .map(x => {
            const output = x[1].trim().split(' ');
            const input = new Map(x[0].split(',').map(x => {
                const content = x.trim().split(' ');
                return [content[1], Number(content[0])];
            }));
            return {
                output: {
                    amount: Number(output[0]),
                    type: output[1]
                },
                input
            }
        });

    const depth = new Map([["ORE", 0]]);
    let hasChanged = true;
    while (hasChanged) {
        hasChanged = false;
        for (const { input, output } of rules) {
            const depths = [...input].map(([type, amount]) => depth.get(type)).filter(x => x !== undefined);
            if (depths.length > 0) {
                const curDepth = depth.get(output.type) || 0;
                const newDepth = Math.max(...depths) + 1;
                if (newDepth > curDepth) {
                    depth.set(output.type, newDepth);
                    hasChanged = true;
                }
            }
        }
    }


    const wat = 1000000000000;
    let minimumFuel = goToSource(new Map([["FUEL", 1]]), rules, depth);
    let willHaveAtLeast = Math.floor(wat / minimumFuel.get('ORE'));

    let min = willHaveAtLeast;
    let max = willHaveAtLeast * 2;
    while (true) {
        let current = Math.floor((min + max) / 2);
        let res = goToSource(new Map([["FUEL", current]]), rules, depth);
        const leftOver = wat - res.get('ORE');
        if (leftOver < 0) {
            max = current;
            continue;
        }
        if (leftOver > minimumFuel.get('ORE')) {
            min = current;
            continue;
        }
        console.log(current);
        return;
    }

    function relevantRules(rules, state, depths) {
        if (!depths) {
            return rules.map(toExecute => canReverseRule(toExecute, state))
                .filter(x => x.good);
        }

        const curDepths = [...state].filter(([type, amount]) => type !== 'ORE' && type !== 'total' && amount > 0)
            .map(([type, amount]) => depth.get(type));
        const allowedDepth = Math.max(...curDepths);
        return rules.filter(x => depths.get(x.output.type) === allowedDepth)
            .map(toExecute => canReverseRule(toExecute, state, true))
            .filter(x => x.good);
    }

    function canReverseRule(rule, state, allowedAnyway) {
        const hasAmount = state.get(rule.output.type) || 0;
        if (!allowedAnyway || hasAmount >= rule.output.amount) {
            const good = hasAmount >= rule.output.amount;
            const amount = Math.floor(hasAmount / rule.output.amount);
            return { good, amount, rule };
        }

        return { good: hasAmount > 0, amount: hasAmount > 0 ? 1 : 0, rule };
    }

    function computePreviousState(rule, state, ruleAmount) {
        for (const [type, amount] of rule.input) {
            const has = state.get(type) || 0;
            state.set(type, has + (amount * ruleAmount));
        }
        const existsAmount = state.get(rule.output.type) || 0;
        const needed = existsAmount - (rule.output.amount * ruleAmount);
        state.set(rule.output.type, needed);
        return state;
    }

    function goToSource(state, rules, depths) {
        let nextRules = relevantRules(rules, state, depths);
        while (nextRules.length > 0) {
            for (const { rule, amount } of nextRules) {
                state = computePreviousState(rule, state, amount);
            }
            nextRules = relevantRules(rules, state, depths);
        }
        return state;
    }
});