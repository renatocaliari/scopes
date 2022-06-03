module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.svelte'],
    content: [
        './src/**/*.{html,js,svelte,ts}',
    ],
    theme: {
        extend: {},
    },

    // https://coolors.co/palette/000000-14213d-fca311-e5e5e5-ffffff
    // #000000
    // #14213D
    // #FCA311
    // #E5E5E5
    // #FFFFFF

    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/colors/themes")["[data-theme=light]"],
                    primary: "#4863ED",
                },
            },
        ],
    },

    // daisyui: {
    //     themes: [{
    //         light: {
    //             // primary: "#FCA311",
    //             // secondary: "#FCA311",
    //             // accent: "#FF6B35",
    //             // neutral: "#3a3a3a",
    //             // "base-100": "#FFFFFF",
    //             // "base-content": "#100f0f",
    //             // info: "#0080bc",
    //             // success: "#5aa867",
    //             // warning: "#d29a2f",
    //             // error: "#b53729",
    //             // "code-bg-color": "#f1db85",
    //         },
    //         // dark: {
    //         //     primary: "#3D52D5",
    //         //     secondary: "#A9CEF4",
    //         //     accent: "#FF6B35",
    //         //     neutral: "#23282E",
    //         //     "base-100": "#3a3a3a",
    //         //     info: "#0080bc",
    //         //     success: "#5aa867",
    //         //     warning: "#d29a2f",
    //         //     error: "#b53729",
    //         //     "code-bg-color": "#f1db85",
    //         // },

    //     }
    //     ]
    // },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require("daisyui"),
    ],

}
