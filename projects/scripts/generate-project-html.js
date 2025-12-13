fetch('/projects/allProjects/projects.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const projects = JSON.parse(data)
        // TODO
    })