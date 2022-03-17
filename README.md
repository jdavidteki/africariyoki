# Description

Online shop prototype implemented using React, Redux, React Router, and React Material UI library.


<img src="https://raw.githubusercontent.com/giorgi-m/online-shop/master/src/Images/screenshot.PNG" width="820" height="420">


**Some features**:
- Search products using keyword and/or category
- Ability to filter and sort products by price
- Users can add products to shopping cart

# How to use

1. Clone the repository.

    _NOTE_: Currently the project has grown in size a bit (roughly 45MB) mainly due to .git folder size (this is probably because I had to upload different versions of a certain .gif file throughout time). To download the project with reduced .git folder size use: ```git clone --depth 1 https://github.com/giorgi-m/online-shop.git```.

2. ```cd``` into the project folder.
3. ```npm install```
4. ```npm start```


 login to aws -  `ssh -i "vocalremovercert.cer" ubuntu@ec2-3-237-22-51.compute-1.amazonaws.com`
 then - `cd Documents/africariyoki/vocalremover`
  and do `nohup ngrok http 5000 && nohup python3 app.py` and then kill terminal without doing ctrl + c

  login to ngrok (https://dashboard.ngrok.com/endpoints/status) online to find addressid for vocal remover sample -	http://2578a634123c.ngrok.io and this can be used to upload songs

to run vocalremover offline, do python3 app.py in root directory
