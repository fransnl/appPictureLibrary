var images = [];

images[0] = 'app-data/library/pictures/planets/GSFC_20171208_Archive_e000332~orig.jpg';
images[1] = 'app-data/library/pictures/planets/hubble-captures-vivid-auroras-in-jupiters-atmosphere_28000029525_o~orig.jpg';
images[2] = 'app-data/library/pictures/planets/PIA05982~orig.jpg';

var i = 0;
var time = 1000;

function prevImg(){
    if(i <= 0 ) //Prevents error and takes you back to the end of the array if you try to go beyond [0]
        i = images.length; 
    //Goes one step back in the array then changes the src attribute.
    document.getElementById('img-box').src = images[--i];
} 

function nextImg(){
  
    if(i >= images.length - 1) 
        i = -1;

    document.getElementById('img-box').src = images[++i];
}

function changeImgAuto()
{
   if(i > images.length - 1)
        i = 0;

   document.getElementById('img-box').src = images[i++];

   setTimeout("changeImgAuto()", time)
}



