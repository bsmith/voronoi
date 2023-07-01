/* show a message, both to the user and on the console */
export function printMessage(message: string) {
    console.log(`message: ${message}`);
    const div = document.createElement("div");
    div.innerText = message;
    const output = document.querySelector("#messages-output");
    if (output == null)
        return;
    output.appendChild(div);
    // div.scrollIntoView();
    output.scrollTop = output.scrollHeight;
}