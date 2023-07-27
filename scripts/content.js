// Insert your own corresponding API keys here
const google_vision_api_key = "";
const google_vision_api_url = "https://vision.googleapis.com/v1/images:annotate?key=";

//API End points
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
        const div = document.createElement("div");
        const button = document.createElement("button");

        div.style.cssText = "border-style: solid; border-width: 2px; width: 75%; margin: 0 auto 0.75em auto; text-align: center;"
        button.style.cssText = "margin: 0.75em 0 0.75em 0"
        button.innerHTML = "Get Description";
        button.addEventListener("click", () => {describeImage(element, div)})
        
        div.appendChild(button)
        element.insertAdjacentElement("afterend", div);
    })
}

//When button is clicked, do a bunch of work to get image descriptions 
const describeImage = async (element, div) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = "Please Wait!";
    div.appendChild(paragraph);
    
    //Data to send to Google Cloud Vision API endpoint
    const google_vision_api_data = {
        "requests":[
            {
                "image":{
                    "source":{
                        "imageUri":element.firstChild.src
                    }
                },
                "features":[
                    {
                        "type":"LABEL_DETECTION",
                        "maxResults":10
                    },
                ]
            }
        ]
    }
    const google_api_post_object = {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(google_vision_api_data)
    }

    //Make request to Google Cloud Vision API to generate labels, or desciptors, of provided image
    let info = await postData(google_vision_api_url + google_vision_api_key,google_api_post_object)
    let labels = info.responses[0].labelAnnotations;
    
    //Filter out descriptors from response
    let descriptors = [];
    for(let i = 0; i < labels.length; i++) {
        if(labels[i].score >= 0.89) {
            descriptors.push(labels[i].description)
        }
    }

    //Form prompt using descriptors to send to ChatGPT
    let content_string = "Give three descriptions of a image highlighting any or all of the following features: ";
    for(let i = 0; i < descriptors.length - 1; i++) {
        console.log(descriptors[i])
        content_string += descriptors[i];
        content_string += ", "
    }
    content_string += "and "
    content_string += descriptors[descriptors.length - 1];

    //Data to send to OpenAI(ChatGPT) endpoint
    const openai_api_data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": content_string
            }
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
    info = await postData(openai_api_url, openai_api_post_object)

    //Parse image descriptions from OpenAI(ChatGPT) response
    const descriptions = info.choices[0].message.content
    const individual_descriptions = descriptions.split(/\r?\n/);
    for(let i = 0; i < individual_descriptions.length; i++) {
        individual_descriptions[i] = individual_descriptions[i].substr(3)
    }

    //Remove "Please Wait!" from div, since we no longer need to wait
    paragraph.remove();

    //Finally, insert desciptions of the image onto the webpage
    for(let i = 0; i < individual_descriptions.length; i++) {
        if(individual_descriptions[i] != "") {
            const p = document.createElement("p");
            p.textContent = individual_descriptions[i]
            div.appendChild(p);
        }
    }
}