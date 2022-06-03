let configClassification = {
    risky: {
        text: 'Risky',
        description:
            "It's risky, difficult or has big unknowns: it's not part of routine work and maybe you don't have the expertise on that for this context yet."
    },
    indispensable: {
        text: 'Nice-to-have',
        description: "It isn't indispensable and can be postponed."
    },
    unclear: {
        text: 'Unclear',
        description:
            "Given the current tasks, you still can't understand this scope well. Break down into simple, actionable, clearly defined tasks"
    },
    tedious: {
        text: 'Tedious',
        description:
            "It probably will be tedious to execute. So, set your environment."
    },
    automatable: {
        text: 'Automatable',
        description: 'It can be automated by an existing tool instead of execute it yourself.'
    },
    delegable: {
        text: 'Delegable',
        description: 'It can be delegated to other person instead of execute it yourself.'
    }
};

export default configClassification;