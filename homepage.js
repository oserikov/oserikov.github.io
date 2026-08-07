const grid = document.querySelector("[data-postcard-grid]");

const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

function isInsideCurlyBraces(markdown, index) {
    const precedingText = markdown.slice(0, index);
    return precedingText.lastIndexOf("{") > precedingText.lastIndexOf("}");
}

function parseInlineContent(markdown) {
    const content = [];
    let lastIndex = 0;

    for (const match of markdown.matchAll(markdownLinkPattern)) {
        if (match.index > lastIndex) {
            content.push({
                type: "text",
                text: markdown.slice(lastIndex, match.index),
            });
        }

        content.push({
            type: "link",
            text: match[1],
            href: match[2],
            monochrome: isInsideCurlyBraces(markdown, match.index),
        });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < markdown.length) {
        content.push({
            type: "text",
            text: markdown.slice(lastIndex),
        });
    }

    return content;
}

function makeLink(link) {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.text;
    if (link.monochrome) {
        anchor.className = "monochrome-link";
    }
    return anchor;
}

function appendInlineContent(container, content) {
    for (const part of content) {
        if (part.type === "link") {
            container.append(makeLink(part));
        } else {
            container.append(part.text);
        }
    }
}

function makeParagraph(text) {
    const paragraph = document.createElement("p");
    const lines = text.split("\n");

    lines.forEach((line, index) => {
        if (index > 0) {
            paragraph.append(document.createElement("br"));
        }
        appendInlineContent(paragraph, parseInlineContent(line));
    });

    return paragraph;
}

function makeFeedbackLine() {
    const paragraph = document.createElement("p");
    paragraph.className = "feedback-line";
    paragraph.append("Leave ");

    const emphasis = document.createElement("strong");
    emphasis.textContent = "feedback";
    paragraph.append(emphasis, " on me / see what others said: ");

    const link = document.createElement("a");
    link.href = "/feedback";
    link.textContent = "link";
    paragraph.append(link, " ");

    const count = document.createElement("span");
    count.id = "feedback-count";
    paragraph.append(count);

    return paragraph;
}

function loadFeedbackCount() {
    if (typeof fetchFeedbackCount !== "function") {
        return;
    }

    fetchFeedbackCount((count) => {
        const countElement = document.getElementById("feedback-count");
        if (countElement && count !== null) {
            countElement.textContent = `(${feedbackCountText(count)} so far)`;
        }
    });
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
    let currentParagraph = "";
    let hardBreakBeforeNextLine = false;
    let index = startIndex;

    while (index < lines.length) {
        const line = lines[index].trim();

        if (line.startsWith("## ") || line.startsWith("- ")) {
            break;
        }

        if (!line) {
            if (currentParagraph) {
                paragraphs.push(currentParagraph);
                currentParagraph = "";
            }
            hardBreakBeforeNextLine = false;
            index += 1;
            continue;
        }

        if (!line.startsWith("### ")) {
            const hasLeadingBreak = line.startsWith("\\");
            const lineWithoutLeadingBreak = hasLeadingBreak
                ? line.slice(1).trimStart()
                : line;
            const hasTrailingBreak = lineWithoutLeadingBreak.endsWith("\\");
            const content = hasTrailingBreak
                ? lineWithoutLeadingBreak.slice(0, -1).trimEnd()
                : lineWithoutLeadingBreak;

            if (content) {
                if (currentParagraph) {
                    currentParagraph += hasLeadingBreak || hardBreakBeforeNextLine
                        ? "\n"
                        : " ";
                }
                currentParagraph += content;
            }

            hardBreakBeforeNextLine = hasTrailingBreak
                || (!content && (hasLeadingBreak || hardBreakBeforeNextLine));
        }
        index += 1;
    }

    if (currentParagraph) {
        paragraphs.push(currentParagraph);
    }

    return {
        paragraphs,
        nextIndex: index,
    };
}

function readListItems(lines, startIndex) {
    const items = [];
    let index = startIndex;

    while (index < lines.length) {
        const line = lines[index].trim();
        if (!line.startsWith("- ")) {
            break;
        }

        items.push(parseInlineContent(line.slice(2).trim()));
        index += 1;
    }

    return {
        items,
        nextIndex: index,
    };
}

function parseHomepage(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    let index = 0;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const titleText = lines[index].replace(/^#\s+/, "").trim();
    const title = parseInlineContent(titleText);
    index += 1;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const imageMatch = lines[index].trim().match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
    const image = imageMatch
        ? { alt: imageMatch[1], src: imageMatch[2] }
        : { alt: titleText, src: "face.jpg" };
    index += imageMatch ? 1 : 0;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const intro = readParagraphs(lines, index);
    index = intro.nextIndex;

    while (index < lines.length && !lines[index].trim()) {
        index += 1;
    }

    const contacts = readListItems(lines, index);
    index = contacts.nextIndex;

    const phases = [];
    while (index < lines.length) {
        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        if (index >= lines.length) {
            break;
        }

        const dateText = lines[index].replace(/^##\s+/, "").trim();
        const date = parseInlineContent(dateText);
        index += 1;

        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        const headingText = lines[index].replace(/^###\s+/, "").trim();
        const heading = parseInlineContent(headingText);
        index += 1;

        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        const body = readParagraphs(lines, index);
        index = body.nextIndex;

        while (index < lines.length && !lines[index].trim()) {
            index += 1;
        }

        const evidence = readListItems(lines, index);
        index = evidence.nextIndex;

        phases.push({
            date,
            heading,
            body: body.paragraphs,
            evidence: evidence.items,
        });
    }

    return {
        title,
        image,
        intro: intro.paragraphs,
        contacts: contacts.items,
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
    appendInlineContent(title, data.title);
    copy.append(title);
    for (const paragraph of data.intro) {
        copy.append(makeParagraph(paragraph));
    }

    layout.append(portraitPanel, copy);

    const contacts = document.createElement("nav");
    contacts.className = "contact-strip";
    for (const item of data.contacts) {
        const contact = document.createElement("span");
        contact.className = "contact-item";
        appendInlineContent(contact, item);
        contacts.append(contact);
    }

    card.append(layout, contacts, makeFeedbackLine());
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
    appendInlineContent(date, phase.date);

    const heading = document.createElement("h2");
    appendInlineContent(heading, phase.heading);

    header.append(date, heading);

    const list = document.createElement("ul");
    list.className = "evidence-list";
    for (const evidence of phase.evidence) {
        const item = document.createElement("li");
        appendInlineContent(item, evidence);
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
        loadFeedbackCount();
    } catch (error) {
        grid.textContent = "Could not load homepage.md. Serve this directory locally or open it through GitHub Pages.";
        console.error(error);
    }
}

renderHomepage();
