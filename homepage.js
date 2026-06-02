const grid = document.querySelector("[data-postcard-grid]");

const markdownLinkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;

function parseLink(markdown) {
    const match = markdown.match(markdownLinkPattern);
    if (!match) {
        return null;
    }

    return {
        text: match[1],
        href: match[2],
    };
}

function makeLink(link) {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.text;
    return anchor;
}

function makeParagraph(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
}

function coverRotationAngle() {
    const rootStyles = getComputedStyle(document.documentElement);
    const coverRotation = rootStyles.getPropertyValue("--cover-rotation").trim();
    const angle = Number.parseFloat(coverRotation);
    return Number.isFinite(angle) ? angle : 0;
}

function randomRotationMagnitude(maxAngle) {
    if (maxAngle <= 0) {
        return 0;
    }

    const randomBytes = new Uint32Array(1);
    crypto.getRandomValues(randomBytes);
    const randomUnit = randomBytes[0] / 0xffffffff;
    return randomUnit * maxAngle;
}

function readParagraphs(lines, startIndex) {
    const paragraphs = [];
    let currentParagraph = [];
    let index = startIndex;

    while (index < lines.length) {
        const line = lines[index].trim();

        if (line.startsWith("## ") || line.startsWith("- ")) {
            break;
        }

        if (!line) {
            if (currentParagraph.length > 0) {
                paragraphs.push(currentParagraph.join(" "));
                currentParagraph = [];
            }
            index += 1;
            continue;
        }

        if (!line.startsWith("### ")) {
            currentParagraph.push(line);
        }
        index += 1;
    }

    if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
    }

    return {
        paragraphs,
        nextIndex: index,
    };
}

function readLinks(lines, startIndex) {
    const links = [];
    let index = startIndex;

    while (index < lines.length) {
        const line = lines[index].trim();
        if (!line.startsWith("- ")) {
            break;
        }

        const link = parseLink(line.slice(2).trim());
        if (link) {
            links.push(link);
        }
        index += 1;
    }

    return {
        links,
        nextIndex: index,
    };
}

function parseHomepage(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    let index = 0;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const title = lines[index].replace(/^#\s+/, "").trim();
    index += 1;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const imageMatch = lines[index].trim().match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
    const image = imageMatch
        ? { alt: imageMatch[1], src: imageMatch[2] }
        : { alt: title, src: "face.jpg" };
    index += imageMatch ? 1 : 0;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const intro = readParagraphs(lines, index);
    index = intro.nextIndex;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const contacts = readLinks(lines, index);
    index = contacts.nextIndex;

    const phases = [];
    while (index < lines.length) {
        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        if (index >= lines.length) {
            break;
        }

        const date = lines[index].replace(/^##\s+/, "").trim();
        index += 1;

        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        const heading = lines[index].replace(/^###\s+/, "").trim();
        index += 1;

        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        const body = readParagraphs(lines, index);
        index = body.nextIndex;

        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        const evidence = readLinks(lines, index);
        index = evidence.nextIndex;

        phases.push({
            date,
            heading,
            body: body.paragraphs,
            links: evidence.links,
        });
    }

    return {
        title,
        image,
        intro: intro.paragraphs,
        contacts: contacts.links,
        phases,
    };
}

function renderCover(data) {
    const card = document.createElement("article");
    card.className = "postcard postcard-cover";

    const layout = document.createElement("div");
    layout.className = "cover-layout";

    const portraitPanel = document.createElement("div");
    portraitPanel.className = "portrait-panel";

    const image = document.createElement("img");
    image.src = data.image.src;
    image.alt = data.image.alt;
    portraitPanel.append(image);

    const copy = document.createElement("div");
    copy.className = "cover-copy";

    const title = document.createElement("h1");
    title.textContent = data.title;
    copy.append(title);
    for (const paragraph of data.intro) {
        copy.append(makeParagraph(paragraph));
    }

    layout.append(portraitPanel, copy);

    const contacts = document.createElement("nav");
    contacts.className = "contact-strip";
    for (const link of data.contacts) {
        contacts.append(makeLink(link));
    }

    card.append(layout, contacts);
    return card;
}

function renderPhase(phase, rotation) {
    const card = document.createElement("article");
    card.className = "postcard phase-card";
    const rotationValue = rotation.toFixed(2);
    card.style.setProperty("--card-rotation", `${rotationValue}deg`);
    card.dataset.rotation = `${rotationValue}deg`;

    const header = document.createElement("header");

    const date = document.createElement("p");
    date.className = "phase-date";
    date.textContent = phase.date;

    const heading = document.createElement("h2");
    heading.textContent = phase.heading;

    header.append(date, heading);

    const list = document.createElement("ul");
    list.className = "evidence-list";
    for (const link of phase.links) {
        const item = document.createElement("li");
        item.append(makeLink(link));
        list.append(item);
    }

    const body = document.createDocumentFragment();
    for (const paragraph of phase.body) {
        body.append(makeParagraph(paragraph));
    }

    card.append(header, body, list);
    return card;
}

async function renderHomepage() {
    try {
        const response = await fetch("homepage.md", { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`Could not load homepage.md: ${response.status}`);
        }

        const data = parseHomepage(await response.text());
        const coverRotation = coverRotationAngle();
        const maxPhaseRotation = Math.abs(coverRotation) / 2;
        const firstSign = coverRotation >= 0 ? -1 : 1;
        const phaseCards = data.phases.map((phase, index) => {
            const sign = index % 2 === 0 ? firstSign : -firstSign;
            return renderPhase(phase, sign * randomRotationMagnitude(maxPhaseRotation));
        });
        grid.replaceChildren(renderCover(data), ...phaseCards);
    } catch (error) {
        grid.textContent = "Could not load homepage.md. Serve this directory locally or open it through GitHub Pages.";
        console.error(error);
    }
}

renderHomepage();
