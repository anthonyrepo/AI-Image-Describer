# AI Image Describer / Accessibility Tool Google Chrome Extension
A Google Chrome extension that provides AI generated desciptions for images on a webpage.

## Objective
The purpose of this Google Chrome extension is to help visually impaired individuals better understand images on web pages.

With the help of Google Cloud Vision API and ChatGPT, descriptions are provided for images upon request.

With the combination of text readers, a visually impaired user is able to experience images on a deeper level compared to HTML default descriptions of images.

## Google Cloud Vision API Usage
The Google Chrome extension is able to send the src link of a image to the Google Cloud Vision API. Machine learning and deep learning techniques are implemented on the image in order to produce labels, or descriptions, of key features of the image.

## ChatGPT Usage
The labels, or descriptions, provided by Google Cloud Vision API are used to give a prompt to ChatGPT using the OpenAI API. The api provides three descriptions of the image which are then inserted into the webpage.

## How to Install and Run the Project
1. Clone the repo onto your machine
2. Sign up and generate API keys for both Google Cloud and OpenAI
    - For Google Cloud, you can use the following guide - https://cloud.google.com/docs/authentication/api-keys
    - For OpenAI, you can use the following webpage - https://platform.openai.com/docs/api-reference/authentication
3. Insert api keys into respective varibles in scripts/content.js (line 7, line 10)
4. Save the repo and open Google Chrome
5. You need to unpack the repo directory inorder to execute the chrome extension, you can follow the following section in this guide - https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked
6. Once you unpack the repo, you can now freely use the extension. Head over to a freecodecamp news page where you can now use the button underneath a image to generate descriptions

## How to Use the Project
1. Head over to a freecodecamp news webpage (For example - https://www.freecodecamp.org/news/freecodecamp-podcast-season-2-developer-interviews/)
2. Locate a image and press the "Get Description" button
![image](./readmeimages/img1.PNG)
3. Wait for the extension to generate the descriptions
![image](./readmeimages/img2.PNG)
4. After a little bit of a wait, the descriptions will be under the "Get Description" button
![image](./readmeimages/img3.PNG)

## Limitations

### Limited Websites Usage
Currently, the google chrome extension only works effectively on freecodecamp news webpages since different webpages structure their HTML image elements differently.

### Inaccurate ChatGPT descriptions
Sometimes ChatGPT will give inaccurate descriptions, such as stating the wrong gender for the subject or give inaccruate colors for the image. Therefore, three descriptions are given to help ammend this.

### Google Cloud Vision API Labels
The Google Cloud Vision API will give multiple labels for a image. Some of these labels are not so accurate compared to others. So to help amend this, only labels with a accuracy of above or equal to 0.89 are used.

This sometimes leads to unhelped labels like "forehead" or "vision care" to be included in the ChatGPT descriptions. Again, providing three descriptions helps amend this.