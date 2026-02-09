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
                        // create video element
                        const projectVideo = document.createElement("iframe");
                        projectVideo.src = currentProject.ThumbnailLink;
                        projectVideo.style = "border: none; position: relative; top: 0; left: 0; height: 100%; width: 100%;";
                        projectVideo.className = "videoThumbnail";

                        // add to the parent div
                        projectImageDiv.appendChild(projectVideo);
                    }

                    // add an event listener to projectImageDiv to redirect to new URL if clicked
                    // projectImageDiv.addEventListener('click', (event) => {
                    //     window.location.href = currentProject.Link;
                    // });

                    // create the project blurb
                    const projectBlurbDiv = document.createElement("div");
                    projectBlurbDiv.className = "projectBlurb";
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
                    // link
                    const blurbLinkText = document.createElement("strong");
                    const blurbLink = document.createElement("a");
                    blurbLink.href = currentProject.Link;
                    blurbLinkText.textContent = "Learn more...";
                    blurbLink.style.fontSize = "24px"
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
                    document.getElementById("projectsContainer").appendChild(projectDiv);

                    projectCount++;
                }
            }
        }
    })