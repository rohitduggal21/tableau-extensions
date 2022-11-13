function initializeExtension()
{

  $(document).ready(function () {

    tableau.extensions.initializeAsync().then(function () {
      console.log("Extension Initialized");

      var splide = new Splide('.splide', 
                              {
                                type      : 'loop',
                                height    : '4rem',
                                drag      : 'free',
                                focus     : 'center',
                                arrows    : false,
                                pagination: false,
                                perPage   : 8,
                                autoStart : true,
                                autoScroll: {speed: 2}
                              });
      splide.mount(window.splide.Extensions);   

    });
  }, function (err) {
    // Something went wrong in initialization.
    console.log('Error while Initializing: ' + err.toString());
  });
}
initializeExtension();