$(function () {
    if (navigator.userAgent.indexOf('Mac OS X')) {
      $('body').append('<style type="text/css">html, body { font-family: \x27Helvetica\x27, \x27Arial\x27, \x27ヒラギノ角ゴ Pro W3\x27, \x27Hiragino Kaku Gothic Pro\x27, sans-serif; } </style>');
    } else {
      $('body').append('<style type="text/css">html, body { font-family: \x27Helvetica\x27, \x27Arial\x27, \x27メイリオ\x27, \x27Meiryo\x27, \x27MS PGothic\x27, sans-serif; } </style>');
    }
    var $window = $(window);

    ['#textarea-left', '#textarea-right'].forEach(function(id) {
        var $textarea = $(id);
        function adjustSize() {
            $textarea.width(  $window.innerWidth() / 2 - 21);
            $textarea.height( $window.innerHeight() );
        }
        var text = localStorage[id];
        if (text) {
            $textarea.val(text);
        }
        $window.on('resize', function () { adjustSize() });
        $textarea.on('keydown', function () {
            localStorage[id] = $textarea.val();
        });
        adjustSize();
    });
});
