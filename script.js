$(document).ready(function() {
    // Alert for button clicks
    $('#orderBtn').click(function() {
        alert('Thank you for choosing Restaurant Delight! Your order has been placed.');
    });

    // Dynamic menu item order alert
    window.showAlert = function(dishName) {
        alert('You have selected ' + dishName + '. Enjoy your meal!');
    };

    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });
});
