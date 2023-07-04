// $(document).ready(function() {
//     $('img[id^="pattern"]').click(function() {
//         var patternId = $(this).attr('id').substring(7); // Récupère l'ID de la pattern en supprimant les premiers 7 caractères ("pattern_")
        
//         var imageIndex;
        
//         switch (patternId) {
//             case '1':
//                 imageIndex = 2; // Remplacez cette valeur par l'index de l'image correspondante (commence à partir de 0)
//                 break;
//             case '2':
//                 imageIndex = 3; // Remplacez cette valeur par l'index de l'image correspondante (commence à partir de 0)
//                 break;
//             // Ajoutez d'autres cas pour les autres IDs de pattern avec les index correspondants
                
//             default:
//                 return; // Sort de la fonction si l'ID de la pattern ne correspond à aucun cas
//         }
        
//         $.ajax({
//             url: '/getimage/' + imageIndex,
//             type: 'GET',
//             success: function(response) {
//                 console.log('Réponse : ' + response);
//                 // Faites ce que vous souhaitez avec la réponse ici (par exemple, afficher l'image dans une zone spécifique)
//             },
//             error: function(xhr, status, error) {
//                 console.log('Erreur : ' + error);
//                 // Gérez l'erreur ici
//             }
//         });
//     });
// });







   // $(document).ready(function() {
//     $('img[id^="pattern"]').click(function() {
//         var id = $(this).attr('id').substring(7); // Récupère l'ID de la pattern en supprimant les premiers 7 caractères ("pattern_")
        
//         $.ajax({
//             url: '/getimage/' + id,
//             type: 'GET',
//             success: function(response) {
//                 console.log('Réponse : ' + response);
//                 // Faites ce que vous souhaitez avec la réponse ici
//             },
//             error: function(xhr, status, error) {
//                 console.log('Erreur : ' + error);
//                 // Gérez l'erreur ici
//             }
//         });
//     });
// });