const timetableContainer = document.getElementById("timetables");

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const numberOfTimetables = 11;


/*
 * ============================================================
 * DAYS WITH NO CLASSES
 * ============================================================
 *
 * Add/remove days here as necessary.
 *
 * For example:
 *
 * 1: ["Thursday"]
 *
 * means that Timetable 1 has no classes on Thursday.
 *
 * 2: ["Tuesday", "Thursday", "Friday"]
 *
 * means that Timetable 2 has no classes on Tuesday, Thursday,
 * or Friday.
 *
 * Timetables not listed here have classes on every day.
 */
const unavailableDays = {
    1: ["Thursday"],
    2: ["Tuesday", "Thursday", "Friday"],
    3: ["Friday"],
    5: ["Friday"],
    6: ["Monday", "Friday"],
    9: ["Monday", "Friday"],
    10: ["Monday", "Friday"]
};


/*
 * Generate a rating dropdown.
 */
function createRatingSelect(name, id, disabled = false) {
    const select = document.createElement("select");

    select.name = name;
    select.id = id;
    select.required = !disabled;
    select.disabled = disabled;

    const options = [
        { value: "", text: disabled ? "No classes" : "Select" },
        { value: "good", text: "Good" },
        { value: "neutral", text: "Neutral" },
        { value: "bad", text: "Bad" }
    ];

    options.forEach(optionData => {
        const option = document.createElement("option");

        option.value = optionData.value;
        option.textContent = optionData.text;

        select.appendChild(option);
    });

    return select;
}


/*
 * Generate one timetable section.
 */
function createTimetable(number) {
    const section = document.createElement("section");

    section.className = "timetable";


    /*
     * Heading
     */
    const heading = document.createElement("h2");

    heading.textContent = `Timetable ${number}`;

    section.appendChild(heading);


    /*
     * Timetable image
     */
    const image = document.createElement("img");

    image.src = `./assets/Slide${number}.JPG`;
    image.alt = `Student timetable ${number}`;
    image.className = "timetable-image";

    section.appendChild(image);


    /*
     * Individual day ratings
     */
    const dayRatings = document.createElement("div");

    dayRatings.className = "day-ratings";


    /*
     * Get the unavailable days for this timetable.
     *
     * If the timetable isn't listed in unavailableDays,
     * use an empty array.
     */
    const unavailable =
        unavailableDays[number] || [];


    days.forEach(day => {

        const dayRating = document.createElement("div");

        dayRating.className = "day-rating";


        /*
         * Check whether this day has no classes.
         */
        const isUnavailable =
            unavailable.includes(day);


        if (isUnavailable) {
            dayRating.classList.add("unavailable");
        }


        /*
         * Label
         */
        const label = document.createElement("label");

        const dayId =
            `slide${number}_${day.toLowerCase()}`;

        label.htmlFor = dayId;
        label.textContent = day;


        /*
         * Dropdown
         */
        const select = createRatingSelect(
            dayId,
            dayId,
            isUnavailable
        );


        dayRating.appendChild(label);
        dayRating.appendChild(select);

        dayRatings.appendChild(dayRating);
    });

    section.appendChild(dayRatings);


    /*
     * Overall timetable rating
     */
    const holisticRating = document.createElement("div");

    holisticRating.className = "holistic-rating";


    const overallId =
        `slide${number}_overall`;


    const overallLabel =
        document.createElement("label");

    overallLabel.htmlFor = overallId;
    overallLabel.textContent =
        "Overall timetable rating:";


    const overallSelect =
        createRatingSelect(
            overallId,
            overallId
        );


    holisticRating.appendChild(overallLabel);
    holisticRating.appendChild(overallSelect);

    section.appendChild(holisticRating);


    return section;
}


/*
 * Generate all timetables.
 */
for (let i = 1; i <= numberOfTimetables; i++) {
    const timetable = createTimetable(i);

    timetableContainer.appendChild(timetable);
}
