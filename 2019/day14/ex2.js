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


    const wat = 1000000000000;
    let state = new Map([['total', 0]]);
    state.set('FUEL', 5650230);
    goToSource(state, rules);
    const oreUsed = state.get('ORE');
    console.log(wat - oreUsed);

    function relevantRules(rules, state) {
        return rules.map(toExecute => canReverseRule(toExecute, state))
            .filter(x => x.good);
    }

    function canReverseRule(rule, state) {
        const hasAmount = state.get(rule.output.type) || 0;
        return { good: hasAmount >= rule.output.amount, amount: Math.floor(hasAmount / rule.output.amount), rule };
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

    function goToSource(state, rules) {
        let nextRules = relevantRules(rules, state);
        while (nextRules.length > 0) {
            for (const { rule, amount } of nextRules) {
                state = computePreviousState(rule, state, amount);
            }
            nextRules = relevantRules(rules, state);
        }
        return state;
    }
});