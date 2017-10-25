/*
 Document   : image-resize-1.0
 Created on : Aug 2012
 Author     : Agustín Bouillet
 Contact    : agustin.bouillet@gmail.com
 url        : www.bouillet.com.ar
 Description:
 */

(function($) {
   $.fn.encuadrador = function(options) {

      var defaults = {
         fadeInSpeed: 100,
         delaySpeed: 0,
         backgroundImage: 'image-resize-1.0/images/camera.png'
      };

      var opts = $.extend(defaults, options);

      // Reseteo los estilos para que no herede nada
      $(this).removeAttr("style width height");
      $(this).addClass("image-resize_attr");


      // Aplico el atributo para que el contenedor de la image funcione como mascara
      $(this).parent().addClass("image-resize_containerAttr");

//
      // Recorro todas las imágenes
      return this.each(function() {

         // Obtengo las pixelss de la imagen
         var src = getSrcWidthHeight(this);


         // Obtengo las pixelss del contenedor de la imagen
         var cont = getContainerWidthHeight(this);



         // levanto las pixelss y la disposicion que debo usar
         var options = getOptionToSample(cont, src);

         // Procesos las imagenes

         render(this, options, cont);

      });



      // Posisiono la imagen dentro de su contenedor realizando el encuadre
      function render(obj, options, cont) {

         var stx = {pixels: "px", minus: "-", space: " "}
         var margin = {right: Math.round(options["height"] / 2), left: Math.round(options["width"] / 2)}


         console.log("get" + cont["width"] + " " + cont["height"]);

         $(obj).parent().css({
            // "width": cont["width"] + stx.pixels,
            "height": cont["height"] + stx.pixels,
            "overflow": "hidden !important",
            "position": "relative",
            "background-image": "url(" + opts.backgroundImage + ")",
            "background-repeat": "no-repeat",
            "background-position": "center center",
         });




         // Posisiono la imagen
         $(obj).delay(opts.delaySpeed).css({
            "top": "50%",
            "left": "50%",
            "position": "absolute",
            "height": options["height"] + stx.pixels,
            "width": (options["width"] + 1) + stx.pixels,
            "margin": stx.minus + margin.right + stx.pixels + stx.space + "0" + stx.space + "0" + stx.pixels + stx.space + stx.minus + margin.left + stx.pixels
         });

         // Muestra la imagen aplicando un efecto
         $(obj).delay(opts.delaySpeed).animate({
            "opacity": "1",
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)", // IE 8
            "filter": "alpha(opacity=100)", // IE 5-7
            "-moz-opacity": "1", // Netscape
            "-khtml-opacity": "1" // Safari 1.x
         }, opts.fadeInSpeed);

         //  alert(options["height"] + stx.space + options["width"]);

      }


      /**
       * Devuelve las pixelss de las imagenes redimensionadas
       */
      function getResizedSize(cont, src) {
         var h = Math.round((cont["width"] * src["height"]) / src["width"]); // Altura final segun la reduccion
         var w = Math.round((cont["height"] * src["width"]) / src["height"]); // Ancho final segun la reduccion

         // Comprimo el alto de la imagen al alto del contendedor
         var useH = new Array();
         useH["width"] = w;
         useH["height"] = cont["height"];

         // Comprimo el ancho de la imagen al ancho del contenedor
         var useW = new Array();
         useW["width"] = cont["width"];
         useW["height"] = h;

         var miArray = new Array();
         miArray["useHeight"] = useH;
         miArray["useWidth"] = useW;

         return miArray;
      }


      /**
       * Segun la disposicion de la imagen, evalua los maximos y decide que
       * tipo de disposicon usar para el resampleador
       */
      function getOptionToSample(cont, src) {
         var resized = getResizedSize(cont, src);
         var miArray = new Array();

         switch (getDisposition(src["width"], src["height"])) {
            case "c":
               miArray["width"] = cont["width"];
               miArray["height"] = resized["useWidth"]["height"];
               miArray["disposition"] = "c";
               break;
            case "v":
               if (resized["useWidth"]["height"] >= cont["height"]) {
                  miArray["width"] = cont["width"];
                  miArray["height"] = resized["useWidth"]["height"];
                  miArray["disposition"] = "v";
               }

               break;
            case "a":
               if (resized["useWidth"]["height"] >= cont["height"]) {
                  miArray["width"] = cont["width"];
                  miArray["height"] = resized["useWidth"]["height"];
                  miArray["disposition"] = "v";
               }
               else if (resized["useWidth"]["height"] < cont["height"]) {
                  miArray["width"] = resized["useHeight"]["width"];
                  miArray["height"] = cont["height"];
                  miArray["disposition"] = "a";
               }
         }

         return miArray;
      }


      /**
       * Devuelve el tamaño real de la imagen
       */
      function getSrcWidthHeight(obj) {
         var h = $(obj).height();
         var w = $(obj).width();

         var miArray = new Array();
         miArray["width"] = w;
         miArray["height"] = h;

         return miArray;
      }


      /**
       * Devuelve el tamaño real del contendor
       */
      function getContainerWidthHeight(obj) {
         var h = $(obj).parent().height();
         var w = $(obj).parent().width();

         var miArray = new Array();
         miArray["width"] = w;
         miArray["height"] = h;

         return miArray;
      }


      /**
       * Detecta la disposición de la imagen
       * c - Cuadrada
       * a - Apaisada
       * v - Vertical
       */
      function getDisposition(width, height) {
         if (width == height) {
            return "c";
         } else if (width > height) {
            return "a";
         } else {
            return "v";
         }
      }


   };
})(jQuery);
