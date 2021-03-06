var mnu       = 'tahunajaran';
var mnu2      = 'departemen';
var dir       = 'models/m_'+mnu+'.php';
var dir2      = 'models/m_'+mnu2+'.php';
var contentFR = '';

// main function ---
    $(document).ready(function(){
        contentFR += '<form autocomplete="off" onsubmit="simpan();return false;" id="'+mnu+'FR">' 
                        +'<input id="idformH" type="hidden">' 
                        
                        // +'<label>Departemen</label>'
                        // +'<div class="input-control text">'
                            +'<input type="hidden" name="departemenH" id="departemenH">'
                            // +'<input disabled type="text" name="departemenTB" id="departemenTB">'
                            // +'<button class="btn-clear"></button>'
                        // +'</div>'
                        
                        +'<label>Tahun Ajaran</label>'
                        +'<div class="span3">'
                            +'<div class="input-control text" >'
                                +'<input required maxlength="9" placeholder="ex : 2011-2012 " name="tahunajaranTB" id="tahunajaranTB" type="text">'
                            +'</div>'
                        +'</div>'

                        // +'<label>Tanggal Mulai</label>'
                        // +'<div class="input-control text" data-role="datepicker"'
                        //     +'data-date="2014-10-23"'
                        //     +'data-format="yyyy-mm-dd"'
                        //     +'data-effect="slide">'
                        //     +'<input id="tglmulaiTB" name="tglmulaiTB" type="text">'
                        //     +'<button class="btn-date"></button>'
                        // +'</div>'

                        // +'<label>Tanggal Akhir</label>'
                        // +'<div class="input-control text" data-role="datepicker"'
                        //     +'data-date="2014-10-23"'
                        //     +'data-format="yyyy-mm-dd"'
                        //     +'data-effect="slide">'
                        //     +'<input id="tglakhirTB" name="tglakhirTB" type="text">'
                        //     +'<button class="btn-date"></button>'
                        // +'</div>'

                        +'<label>Keterangan</label>'
                        +'<div class="input-control textarea">'
                            +'<textarea placeholder="keterangan" name="keteranganTB" id="keteranganTB"></textarea>'
                        +'</div>'
                        
                        +'<div class="form-actions">' 
                            +'<button class="button primary">simpan</button>&nbsp;'
                            +'<button class="button" type="button" onclick="$.Dialog.close()">Batal</button> '
                        +'</div>'
                    +'</form>';

        // combo departemen
        cmbdepartemen();

        //add form
        $("#tambahBC").on('click', function(){
            viewFR('');
        });

        //search action
        $('#tahunajaranS,#keteranganS').keydown(function (e){
            if(e.keyCode == 13) viewTB();
        });$('#departemenS').on('change',function(){
            viewTB();
        });
    }); 
// end of save process ---

//save process ---
    function simpan(){
        var urlx ='&aksi=simpan';
        if($('#idformH').val()!='') urlx += '&replid='+$('#idformH').val();

        var u =dir;
        var d = $('form').serialize()+urlx;
        ajax(u,d).done(function (dt){
            if(dt.status!='sukses'){
                cont = 'Gagal menyimpan data';
                clr  = 'red';
            }else{
                $.Dialog.close();
                kosongkan();
                viewTB();
                cont = 'Berhasil menyimpan data';
                clr  = 'green';
            }
            notif(cont,clr);
        });
    }

    function viewTB(subaksi){
        var aksi ='aksi=tampil';
        if(typeof subaksi!=='undefined'){
            aksi+='&subaksi='+subaksi;
        }
        var cari ='';
        var el,el2;

        if(typeof subaksi!=='undefined'){ // multi paging
            el  = '.'+subaksi+'_cari';
            el2 = '#'+subaksi+'_tbody';
        }else{ // single paging
            el  = '.cari';
            el2 = '#tbody';
        }

        $(el).each(function(){
            var p = $(this).attr('id');
            var v = $(this).val();
            cari+='&'+p+'='+v;
        });

        $.ajax({
            url : dir,
            type: 'post',
            data: aksi+cari,
            beforeSend:function(){
                $(el2).html('<tr><td align="center" colspan="6"><img src="img/w8loader.gif"></td></tr>');
            },success:function(dt){
                setTimeout(function(){
                    $(el2).html(dt).fadeIn();
                },1000);
            }
        });
    }


// form ---
    function viewFR(id){
        $.Dialog({
            shadow: true,
            overlay: true,
            draggable: true,
            width: 500,
            padding: 10,
            onShow: function(){
                var titlex;
                if(id==''){  //add mode
                    titlex='<span class="icon-plus-2"></span> Tambah ';
                    $.ajax({
                        url:dir2,
                        data:'aksi=cmbdepartemen&replid='+$('#departemenS').val(),
                        type:'post',
                        dataType:'json',
                        success:function(dt){
                            $('#departemenH').val($('#departemenS').val());
                            $('#departemenTB').val(dt.departemen[0].nama);
                        }
                    });

                }else{ // edit mode
                    titlex='<span class="icon-pencil"></span> Ubah';
                    $.ajax({
                        url:dir,
                        data:'aksi=ambiledit&replid='+id,
                        type:'post',
                        dataType:'json',
                        success:function(dt){
                            $('#idformH').val(id);
                            $('#departemenH').val(dt.id_departemen);
                            $('#tahunajaranTB').val(dt.tahunajaran);
                            $('#keteranganTB').val(dt.keterangan);
                        }
                    });
                }$.Dialog.title(titlex+' '+mnu);
                $.Dialog.content(contentFR);
            }
        });
    }
// end of form ---

//paging ---
    function pagination(page,aksix,subaksi){ 
        var aksi ='aksi='+aksix+'&subaksi='+subaksi+'&starting='+page;
        var cari ='';
        var el,el2;

        if(subaksi!=''){ // multi paging 
            el  = '.'+subaksi+'_cari';
            el2 = '#'+subaksi+'_tbody';
        }else{ // single paging
            el  = '.cari';
            el2 = '#tbody';
        }

        $(el).each(function(){
            var p = $(this).attr('id');
            var v = $(this).val();
            cari+='&'+p+'='+v;
        });

        $.ajax({
            url:dir,
            type:"post",
            data: aksi+cari,
            beforeSend:function(){
                $(el2).html('<tr><td align="center" colspan="8"><img src="img/w8loader.gif"></td></tr></center>');
            },success:function(dt){
                setTimeout(function(){
                    $(el2).html(dt).fadeIn();
                },1000);
            }
        });
    }
//end of paging ---
    
//del process ---
    function del(id){
        if(confirm('melanjutkan untuk menghapus data?'))
        $.ajax({
            url:dir,
            type:'post',
            data:'aksi=hapus&replid='+id,
            dataType:'json',
            success:function(dt){
                var cont,clr;
                if(dt.status!='sukses'){
                    cont = '..Gagal Menghapus '+dt.terhapus+' ..';
                    clr  ='red';
                }else{
                    viewTB();
                    cont = '..Berhasil Menghapus '+dt.terhapus+' ..';
                    clr  ='green';
                }
                notif(cont,clr);
            }
        });
    }
//end of del process ---
    
// notifikasi
    function notif(cont,clr) {
        var not = $.Notify({
            caption : "<b>Notifikasi</b>",
            content : cont,
            timeout : 3000,
            style :{
                background: clr,
                color:'white'
            },
        });
    }
// end of notifikasi

//reset form ---
    function kosongkan(){
        $('#idformTB').val('');
        $('#tahunajaranTB').val('');
        $('#tglmulaiTB').val('');
        $('#tglakhirTB').val('');
        $('#keteranganTB').val('');
    }
//end of reset form ---

// combo departemen ---
    function cmbdepartemen(){
        var u = dir2;
        var d ='aksi=cmbdepartemen';
        ajax(u,d).done(function (dt) {
            var out='';
            if(dt.status!='sukses'){
                out+='<option value="">'+dt.status+'</option>';
            }else{
                $.each(dt.departemen, function(id,item){
                    out+='<option value="'+item.replid+'">'+item.nama+'</option>';
                });
                $('#departemenS').html(out);
                viewTB();
            }
        });
    }
//end of combo departemen ---

//aktifkan process ---
    function aktifkan(id){
    	var dep = $('#'+mnu2+'S').val();

        if(confirm(' mengaktifkan ?'))
        $.ajax({
            url:dir,
            type:'post',
            data:'aksi=aktifkan&replid='+id+'&departemen='+dep,
            dataType:'json',
            success:function(dt){
                var cont,clr;
                if(dt.status!='sukses'){
                    cont = '..Gagal Mengaktifkan  ..';
                    clr  ='red';
                }else{
                    viewTB();
                    cont = '..Berhasil Mengaktifkan '+th+' ..';
                    clr  ='green';
                }
                notif(cont,clr);
            }
        });
    }

// fungsi AJAX : asyncronous
    function ajax(u,d) {
        return $.ajax({
            url:u,
            type:'post',
            dataType:'json',
            data:d
        });
    }