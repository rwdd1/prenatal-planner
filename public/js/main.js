function showMenu() {
    header.classList.toggle("show-menu");
}

async function sendForm(e) {
    e.preventDefault();
    e.target.disabled = true;
    
    const res =  await fetch("/find/edit?_method=PUT", {
        method: "POST",
        body: new FormData(e.target.parentNode)
    });
    
    let insert = document.createElement("p");

    if (res.status !== 500) {
        const updated = await res.json();
        insert.classList.add("updated-record");
        insert.innerText = `New value: ${updated}`;
    } else {
        insert.classList.add("update-error");
        insert.innerText = `Error: please ensure all fields are completed.`;
    }
    e.target.insertAdjacentElement("afterend", insert);
    setTimeout(() => {
        insert.remove();
        e.target.disabled = false;
    }, 5000);   
}

if (typeof mobileMenu !== "undefined") {
    mobileMenu.addEventListener("click", showMenu);
}
if (typeof findTable !== "undefined") {
    document.querySelectorAll(".find-button").forEach( i => i.addEventListener("click", sendForm) );
}