var mnu  = 'guru';
var mnu2 = 'departemen';
var mnu3 = 'tahunajaran';
var mnu4 = 'pelajaran';

var dir  = 'models/m_'+mnu+'.php';
var dir2 = 'models/m_'+mnu2+'.php';
var dir3 = 'models/m_'+mnu3+'.php';
var dir4 = 'models/m_'+mnu4+'.php';

var contentFR = '';

// main function ---
    $(document).ready(function(){
        viewTB();
        contentFR+='<div style="overflow:scroll;height:500px;" >'
                    +'<form onsubmit="simpan();return false;" autocomplete="off">'
                        +'<input id="idformH" type="hidden">' 

                        // nama / nip
                        +'<label>NIP / Nama </label>'
                        +'<div class="input-control text">'
                            +'<input onblur="validSelect(\'karyawan\');" onchange="validSelect(\'karyawan\');" required placeholder="NIP / nama pegawai" id="karyawanTB">'
                            +'<input type="hidden" name="karyawanH" id="karyawanH" >'
                            +'<button class="btn-clear"></button>'
                        +'</div>'

                        // pelajaran
                        +'<label>Pelajaran</label>'
                        +'<div class="input-control select">'
                            +'<select required name="pelajaranTB" id="pelajaranTB"></select>'
                        +'</div>'

                        // keterangan
                        +'<label>Keterangan</label>'
                        +'<div class="input-control textarea">'
                            +'<textarea placeholder="keterangan" name="keteranganTB" id="keteranganTB"></textarea>'
                        +'</div>'

                        // button
                        +'<div class="form-actions">' 
                            +'<button class="button primary">simpan</button>&nbsp;'
                            // +'<button class="button" type="button" onclick="$.Dialog.close()">Batal</button> '
                        +'</div>'
                    +'</form>'
                +'</div>';

        //add form
        $("#tambahBC").on('click', function(){
            viewFR('');
        });

        //search action
        $('#nipS,#namaS,#pelajaranS,#keteranganS').on('keydown',function  (e) {
            if(e.keyCode==13) viewTB();
        });
    }); 
// end of save process ---

    function cariTR () {
        $('#nipS').val('');
        $('#guruS').val('');
        $('#cariTR').toggle('slow');
    }

    function validSelect (e) {
        if($('#'+e+'H').val()==''){
            $('#'+e+'TB').val('');
        }
    }

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
            }cmbtahunajaran(dt.departemen[0].replid);
        });
    }
//end of combo departemen ---

// combo tahunajaran ---
    function cmbtahunajaran(dep){
        $.ajax({
            url:dir3,
            data:'aksi=cmbtahunajaran&departemen='+dep,
            dataType:'json',
            type:'post',
            success:function(dt){
                var out='';
                if(dt.status!='sukses'){
                    out+='<option value="">'+dt.status+'</option>';
                }else{
                    $.each(dt.tahunajaran, function(id,item){
                        if(item.aktif=='1'){
                            out+='<option selected="selected" value="'+item.replid+'">'+item.tahunajaran+' (aktif)</option>';
                        }else{
                            out+='<option value="'+item.replid+'">'+item.tahunajaran+'</option>';
                        }
                    });
                }$('#tahunajaranS').html(out);
                cmbpelajaran(dt.tahunajaran[0].replid,'filter','');
            }
        });
    }
//end of combo tahunajaran ---

// combo pelajaran ---
    function cmbpelajaran(typ,pel){
        var u = dir4;
        var d = 'aksi=cmbpelajaran';
        ajax(u,d).done(function (dt){
            var out='';
            if(dt.status!='sukses'){
                out+='<option value="">'+dt.status+'</option>';
            }else{
                $.each(dt.pelajaran, function(id,item){
                    out+='<option '+(pel==item.replid?'selected':'')+' value="'+item.replid+'">'+item.nama+'</option>';
                });
            }
            if(typ=='form'){// form
                $('#pelajaranTB').html('<option value="">-Pilih Pelajaran-</option>'+out);
            }else{// filtering 
                $('#pelajaranS').html('<option value="">-Semua-</option>'+out);
                viewTB();
            }
        });
    }
//end of combo pelajaran ----

//save process ---
    function simpan(){
        var urlx ='&aksi=simpan&tahunajaran='+$('#tahunajaranS').val();
        if($('#idformH').val()!='') //edit mode
            urlx += '&replid='+$('#idformH').val();

        var u= dir;
        var d=$('form').serialize()+urlx;
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
//end of save process ---
    
// view table ---
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


// autosuggest
    function autoSuggest(kar,el,subaksi){
        var urlx= '?aksi=autocomp&subaksi='+subaksi+(kar!=''?'&karyawan='+kar:'');
        var col =[{
                'align':'left',
                'columnName':'nip',
                'hide':true,
                'width':'30',
                'label':'NIP'
            },{   
                'align':'left',
                'columnName':'nama',
                'width':'70',
                'label':'NAMA'
            }];

        urly = dir+urlx;
        $('#'+el+'TB').combogrid({
            debug:true,
            width:'500px',
            colModel: col ,
            url: urly,
            select: function( event, ui ) { // event setelah data terpilih 
                $('#'+el+'H').val(ui.item.replid);
                $('#'+el+'TB').val(ui.item.nip+' / '+ui.item.nama);

                // validasi input (tidak sesuai data dr server)
                    $('#'+el+'TB').on('keyup', function(e){
                        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                        var keyCode = $.ui.keyCode;
                        if(key != keyCode.ENTER && key != keyCode.LEFT && key != keyCode.RIGHT && key != keyCode.UP && key != keyCode.DOWN ) {
                            if($('#'+el+'H').val()!=''){
                                $('#'+el+'H').val('');
                                $('#'+el+'TB').val('');
                            }
                        }
                    });
                    $('#'+el+'TB').on('blur,change',function(){
                        if($('#'+el+'H').val()=='') {
                            $('#'+el+'TB').val(''); // :: all 
                        }
                    });
                return false;
            }
        });
    }


// form ---
    function viewFR(id){
        $.Dialog({
            shadow:true,
            overlay:true,
            draggable:true,
            height:'auto',
            width:'35%',
            padding:20,
            onShow: function(){
                var titlex;
                $('#tahunajaranH').val($('#tahunajaranS').val());
                $.Dialog.content(contentFR);
                if (id!='') { // edit mode
                    ajax(dir,'aksi=ambiledit&replid='+id).done(function (dt){
                        $('#idformH').val(id);
                        $('#karyawanH').val(dt.idkaryawan); /*epiii*/
                        $('#karyawanTB').val(dt.nip+' - '+dt.nama); /*epiii*/
                        $('#nipTB').val(dt.nip);
                        $('#keteranganTB').val(dt.keterangan);
                        cmbpelajaran('form',dt.pelajaran);
                        autoSuggest(dt.idkaryawan,'karyawan','karyawan');
                    });titlex='<span class="icon-pencil"></span> Ubah ';
                }else{ //add mode
                    cmbpelajaran('form','');
                    titlex='<span class="icon-plus-2"></span> Tambah ';
                    autoSuggest('','karyawan','karyawan');
                }$('#pegawaiTB').focus();
                $.Dialog.title(titlex+' '+mnu);
            }
        });
    }
// end of form ---

// //paging ---
    function pagination(page,aksix){
        var datax = 'starting='+page+'&aksi='+aksix;
         var cari = '&departemenS='+$('#departemenS').val()
                    +'&tahunajaranS='+$('#tahunajaranS').val()
                    +'&pelajaranS='+$('#pelajaranS').val();
        $.ajax({
            url:dir,
            type:"post",
            data: datax+cari,
            beforeSend:function(){
                $('#tbody').html('<tr><td align="center" colspan="7"><img src="img/w8loader.gif"></td></tr></center>');
            },success:function(dt){
                setTimeout(function(){
                    $('#tbody').html(dt).fadeIn();
                },1000);
            }
        });
    }   
//end of paging ---
    
//del process ---
    function del(id){
        if(confirm('melanjutkan untuk menghapus data?'))
        var u= dir;
        var d='aksi=hapus&replid='+id;
        ajax(u,d).done(function (dt){
            var cont,clr;
            if(dt.status!='sukses'){
                cont = '..Gagal Menghapus '+dt.terhapus+' ['+dt.status+']';
                clr  ='red';
            }else{
                viewTB();
                cont = '..Berhasil Menghapus '+dt.terhapus+' ..';
                clr  ='green';
            }
            notif(cont,clr);
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
        $('#pelajaranTB').val('');
        $('#namaTB').val('');
        $('#nipTB').val('');
        $('#keteranganTB').val('');
    }

    function ajax (u,d) {
        return $.ajax({
            url:u,
            data:d,
            dataType:'json',
            type:'post',
        });
    }