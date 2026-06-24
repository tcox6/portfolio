// Define specific colours for some of the tags
const SPECIFIC_TAG_COLOURS = {
    "Machine Learning": "#FFB3BA",
    "Reinforcement Learning": "#FFFFBA",
    "Python": "#BAFFC9",
    "Research": "#BAE1FF",
    "TensorFlow": "#FFDFBA"
};
// Define a universe of colours that can be used for other tags
const OTHER_COLOURS = ["#8D9DF5", "#D4EAA9", "#FCACB9", "#32BEB1"];

// get JSON and generate HTML
fetch('/projects/allProjects/projects.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const projects = data;

        // generate a random order for the projects
        let projectsOrder = [];
        for (let i = 0; i < projects.Projects.length; i++) {
            projectsOrder[i] = i;
        }
        projectsOrder.sort(() => Math.random() - 0.5);

        // generate the html for all projects
        let projectCount = 0; // number of projects processed
        for (let i = 0; i < projects.Projects.length; i++) {
            // get the current project
            let currentProject = projects.Projects[projectsOrder[i]];

            // skip if hidden flag set to true
            if (!currentProject.Hidden) {
                // Don't show non-featured projects on home page
                if (featuredFlag && currentProject.Featured || !featuredFlag) {
                    // create the parent container for the project
                    const projectDiv = document.createElement("div");
                    projectDiv.className = "project";

                    // create the image/video thumbnail
                    const projectImageDiv = document.createElement("div");
                    projectImageDiv.className = "projectImage";
                    // add either an image or video element to the div
                    if (currentProject.ThumbnailType == "Static Image") {
                        // create image element
                        const projectImage = document.createElement("img");
                        projectImage.src = currentProject.ThumbnailLink;

                        // add to the parent div
                        projectImageDiv.appendChild(projectImage);
                    } else if (currentProject.ThumbnailType == "Video") {
                        // create video element (iframe pointing to Cloudfare Stream endpoint)
                        // Need to wrap this in a parent container that can be set to display: flex
                        // to prevent weird width != height styling issues.
                        const projectVideoParent = document.createElement("div");
                        projectVideoParent.style.display = "flex";
                        const projectVideo = document.createElement("iframe");
                        projectVideo.src = currentProject.ThumbnailLink;
                        projectVideo.style = "border: none; position: relative; top: 0; left: 0; height: 100%; width: 100%;";
                        projectVideo.className = "videoThumbnail";

                        // add to the parent div
                        projectVideoParent.appendChild(projectVideo);
                        projectImageDiv.appendChild(projectVideoParent);
                    }

                    // add an event listener to projectImageDiv to redirect to new URL if clicked
                    // projectImageDiv.addEventListener('click', (event) => {
                    //     window.location.href = currentProject.Link;
                    // });

                    // create the project blurb
                    const projectBlurbDiv = document.createElement("div");
                    projectBlurbDiv.className = "projectBlurb";
                    // Date
                    const blurbDate = document.createElement("span");
                    const blurbDateItalics = document.createElement("i");
                    blurbDateItalics.textContent = currentProject.Year;
                    blurbDate.appendChild(blurbDateItalics);
                    projectBlurbDiv.appendChild(blurbDate);
                    // blurb header
                    const blurbHeader = document.createElement("h2");
                    blurbHeader.textContent = currentProject.Title;
                    projectBlurbDiv.appendChild(blurbHeader);
                    // blurb paragraphs
                    const paragraphs = [];
                    for (let p = 0; p < currentProject.Blurb.length; p++) {
                        paragraphs[p] = document.createElement("p");
                        paragraphs[p].textContent = currentProject.Blurb[p];
                        projectBlurbDiv.appendChild(paragraphs[p]);
                    }
                    // Tags
                    const tagContainer = document.createElement("div");
                    tagContainer.classList.add("tagContainer");
                    projectBlurbDiv.appendChild(tagContainer);
                    const tags = [];
                    for (let t = 0; t < currentProject.Tags.length; t++) {
                        tags[t] = document.createElement("span");
                        tags[t].textContent = currentProject.Tags[t];
                        // Set background colour of span
                        if (currentProject.Tags[t] in SPECIFIC_TAG_COLOURS) {
                            tags[t].style.backgroundColor = SPECIFIC_TAG_COLOURS[currentProject.Tags[t]];
                        } else {
                            tags[t].style.backgroundColor = OTHER_COLOURS[Math.floor(Math.random() * OTHER_COLOURS.length)]
                        }
                        tagContainer.appendChild(tags[t]);
                    }
                    // link
                    const blurbLinkText = document.createElement("strong");
                    const blurbLink = document.createElement("a");
                    blurbLink.href = currentProject.Link;
                    blurbLinkText.textContent = "Learn more...";
                    blurbLink.style.fontSize = "20px";
                    projectBlurbDiv.appendChild(blurbLink);
                    blurbLink.appendChild(blurbLinkText);

                    // add all elements to their parent container
                    if (projectCount % 2 == 0) {
                        // blurb to the left when i is even
                        projectDiv.appendChild(projectBlurbDiv);
                        projectDiv.appendChild(projectImageDiv);
                    } else {
                        // image to the left when i is odd
                        projectDiv.appendChild(projectImageDiv);
                        projectDiv.appendChild(projectBlurbDiv);
                    }
                    const hr = document.createElement("hr");
                    document.getElementById("allProjects").appendChild(projectDiv);
                    document.getElementById("allProjects").appendChild(hr);

                    projectCount++;
                }
            }
        }
    })