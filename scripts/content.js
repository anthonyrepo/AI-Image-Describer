// Insert your own corresponding API keys here

const openai_api_key = "";
const openai_api_url = "https://api.openai.com/v1/chat/completions";

//Makes a post request to a desired endpoint using specific data
async function postData(url = "", data = {}) {
    const response = await fetch(url, data);
    return response.json();
}

//Parses through the webpage and gets all figure elements
const figures = document.querySelectorAll("figure")
if (figures) {
    //For each figure, add a div element which will show a button to display desciptions in
    figures.forEach(element => {
        const cap = document.createElement("figcaption")
        const button = document.createElement("button");

        cap.style.cssText = "border-style: solid; border-width: 2px; text-align: center; line-height: normal;"
        button.style.cssText = "margin: 0.75em 0 0.75em 0"
        button.innerHTML = "Get Description";
        button.addEventListener("click", () => {describeImage(element, cap)})
        
        cap.appendChild(button)
        element.insertAdjacentElement("beforeend", cap)
    })
}

//When button is clicked, do a bunch of work to get image descriptions 
// const describeImage = async (element, div) => {
const describeImage = async (element, cap) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = "Please Wait!";
    // div.appendChild(paragraph);
    cap.appendChild(paragraph);

    let image_url = element.firstChild.firstChild.src;

    //Form prompt using descriptors to send to ChatGPT
    // let content_string = "Give three descriptions of a image highlighting any or all of the following features: ";
    // for(let i = 0; i < descriptors.length - 1; i++) {
    //     console.log(descriptors[i])
    //     content_string += descriptors[i];
    //     content_string += ", "
    // }
    // content_string += "and "
    // content_string += descriptors[descriptors.length - 1];

    //Data to send to OpenAI(ChatGPT) endpoint
    // const openai_api_data = {
    //     "model": "gpt-3.5-turbo",
    //     "messages": [
    //         {
    //             "role": "system",
    //             "content": "You are a helpful assistant."
    //         },
    //         {
    //             "role": "user",
    //             "content": content_string
    //         }
    //     ]
    // }
    // let image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Accessibility_Braille_Elevator.jpg/220px-Accessibility_Braille_Elevator.jpg"

    const openai_api_data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image to a visually impaired user"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url
                        }
                    }
                ]
            },
        ]
    }
    const openai_api_post_object = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + openai_api_key
        },
        body: JSON.stringify(openai_api_data)
    }

    //Make request to OpenAI(ChatGPT) endpoint to get image descriptions using Google Cloud Vision API's labels
    let info = await postData(openai_api_url, openai_api_post_object)

    //Parse image descriptions from OpenAI(ChatGPT) response
    // const descriptions = info.choices[0].message.content
    // const individual_descriptions = descriptions.split(/\r?\n/);
    // for(let i = 0; i < individual_descriptions.length; i++) {
    //     individual_descriptions[i] = individual_descriptions[i].substr(3)
    // }

    //Remove "Please Wait!" from div, since we no longer need to wait
    paragraph.remove();

    const fc = document.createElement("figcaption");
    fc.textContent = info.choices[0].message.content;
    cap.appendChild(fc);
}