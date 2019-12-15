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

    let state = goToSource(new Map([['FUEL', 1]]), rules, depth);
    console.log(state.get('ORE'));

    function relevantRules(rules, state, depths) {
        const allowedDepth = Math.max(...[...state].filter(([type, amount]) => type !== 'ORE' && type !== 'total' && amount > 0)
            .map(([type, amount]) => depths.get(type)));
        return rules.filter(rule => canReverse(rule, state, depths, allowedDepth)).map(toExecute => reverseRule(toExecute, state, true))
    }

    function canReverse(rule, state, depths, allowedDepth) {
        return state.get(rule.output.type) > 0
            && (depths.get(rule.output.type) === allowedDepth || state.get(rule.output.type) >= rule.output.amount);
    }

    function reverseRule(rule, state) {
        const hasAmount = state.get(rule.output.type) || 0;
        return hasAmount >= rule.output.amount
            ? { amount: Math.floor(hasAmount / rule.output.amount), rule }
            : { amount: 1, rule };
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