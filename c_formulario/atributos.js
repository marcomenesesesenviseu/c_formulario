// Atributos

// undefined - normal
// M - maiúsculas
// m - minúsculas
$.fn.tagName = function(forma = undefined) {
    switch(forma) {
        case 'M':
            return this.prop("tagName").toUpperCase();
        case 'm':
            return this.prop("tagName").toLowerCase();
        default: 
            return this.prop("tagName");
    }
};

$.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
};

// habilitar e desabilitar, habilitado e desabilitado
$.fn.habilitado = function() { 
    let self = this;
    return !self.hasAttr("disabled");
}

$.fn.desabilitado = function() { 
    let self = this;
    return self.hasAttr("disabled");
}

$.fn.habilitar = function() { 
    let self = this;
    if (self.desabilitado())
        return self.removeAttr('disabled');
}

$.fn.desabilitar = function() { 
    let self = this;
    if (self.habilitado()){
        return self.prop('disabled', true);
    }
}

// fim

$.fn.alteraClasse = function ( removals, additions ) {
    let self = this;

    if ( removals.indexOf( '*' ) === -1 ) {
        // Use native jQuery methods if there is no wildcard matching
        self.removeClass( removals );
        return !additions ? self : self.addClass( additions );
    }

    let patt = new RegExp( '\\s' + 
            removals.
            replace( /\*/g, '[A-Za-z0-9-_]+' ).
            split( ' ' ).
            join( '\\s|\\s' ) + 
            '\\s', 'g' );

    self.each( function ( i, it ) {
        var cn = ' ' + it.className + ' ';
        while ( patt.test( cn ) ) {
            cn = cn.replace( patt, ' ' );
        }
        it.className = $.trim( cn );
    });

    return !additions ? self : self.addClass( additions );
}

//  INPUTS CAIXA DE TEXTO

$.fn.contar_repeticoes = (texto = undefined) => {
    if (texto === undefined) { console.log('Não foi definido o texto a procurar'); return -1 };
    if (typeof this !== 'string') { console.log('O objeto não é uma string'); return -2; }
    
    let stringLC = this.toLowerCase();
    let wordLC = texto.toString().toLowerCase();

    let count = stringLC.split(wordLC).length - 1;
    
    return count
};

$.fn.devolve_tamanho = function(tamanho=undefined) {
    if ($.isNumeric(tamanho)) {
        if ($(this).val().length == tamanho)
            return true;
        else
            return false;
    }

    return $(this).val().length;
};

$.fn.contar_espacos = function() {
    return this.val().split(" ").length-1;
};

$.fn.valCodigoPostal = function() {
    if ($(this).toString().length != 8) return false;

    if (!($(this).toString()[4] == "-")) return false;

    var $parte1 = $(this).substring(0, 4);
    var $parte2 = $(this).substring(5, 8);

    if ($parte1.length != 4 || $parte2.length != 3) {
        return false;
    } else if (!($.isNumeric($parte1)) || !($.isNumeric($parte2))) {
        return false;
    }

    return true;
};

$.fn.limpar_espacos = function () {
    console.log(this.is("form"));
    this
    .find("input[type=text],input[type=date],textarea")
    .each(function () {
        $(this).val($(this).val().trim());
    });
}

// INPUTS CECKBOX

// Teste de verificação
$.fn.verificado = function () {
    return this.is("checked")
}

$.fn.naoverificado = function () {
    return !this.is("checked")
}

// fim

$.fn.selecionar = function () {
    this.prop("checked", true);
}

$.fn.deselecionar = function () {
    this.prop("checked", false);
}

$.fn.valor_input_check = function(valor) {
    if (valor == 0)
        this.removeAttr("checked");
    else if (valor == 1)
        if (!this.hasAttr("checked"))
        this.removeAttr("checked","checked");
    return this;
};

// TOOLTIPS

$.fn.atualiza_tooltip = function(texto, classe="", elem = this) {
    const bsTooltip = new bootstrap.Tooltip(elem, {title: texto, customClass: classe});
    return bsTooltip;
}

// FORMULÁRIOS

$.fn.elimina_tooltip = function(elem = this) {
    elem.tooltip('dispose');
}

$.fn.desabilitar_formulario = function () {
    this
    .find("input,textarea,select,button")
    .each(function () {
        if (!$(this).hasAttr("disabled")) $(this).attr("disabled","disabled");
    });
}

$.fn.habilitar_formulario = function () {
    this
    .find("input,textarea,select,button")
    .each(function () {
        if ($(this).hasAttr("disabled")) $(this).removeAttr("disabled");
    });
}