<?php require_once(MODDIR.'xform/xform.php'); require_once(MODDIR.'control.php');
$opt=gpost('opt'); $cid=gpost('cid'); if($cid=='')$cid=0;

$ssid=session_id();
dbDel("pus_tpjm","ssid='$ssid'");

$fmod='peminjaman';
$xform=new xform($fmod,$opt,$cid);

if($opt=='uf'){ // Nilai field editan
	//$t=mysql_query("SELECT * FROM pus_katalog WHERE replid='$cid' LIMIT 0,1");
	//$data=mysql_fetch_array($t);
	$ttl='Edit';
}
else { // Nilai field default
	$data=farray();
	$ttl='Tambah';
	$data['tanggal1']=date("Y-m-d");
	$data['tanggal2']=date("Y-m-d",strtotime("+7 day"));
}

$xform->title($ttl.' data peminjaman');
$xform->table_begin();
	$xform->col_begin('50%');
	$xform->set_fieldw(340);
	$xform->group_begin('Data Peminjam');
		$s='<button title="Cari" class="btn" style="margin-right:4px" onclick="sirkulasi_member_add()"><div class="bi_srcb">&nbsp;</div></button>';
		$xform->fi('Peminjam',iText('smember','','width:250px;margin-right:4px','ID atau nama member','onkeyup="sirkulasi_member_cari(event)"').$s);
		hiddenval('member_id',0);
		hiddenval('member_tipe',0);
		hiddenval('sirkulasi_form',1);
	echo '<div id="datamember" class="xrowl" style="margin-top:10px">';
	require_once(APPDIR.'sirkulasi_datamember.php');
	echo '</div>';
	
	$xform->col_begin('50%');
	$xform->set_labelw(150);
	$xform->group_begin('Periode Peminjaman');
		$xform->fi('Tanggal peminjaman',inputTanggal('tanggal1',$data['tanggal1']));
		$xform->fi('Tanggal pengembalian',inputTanggal('tanggal2',$data['tanggal2']));
	$xform->group_begin('Catatan Peminjaman',160);
	$xform->set_labelw(150);
		$xform->fi('Keterangan',iTextarea('keterangan','','width:250px',5));

$xform->table_end(0);

$xform->table_begin();
	
	$xform->col_begin(); $xform->group_unflowdiv();
	$xform->group_begin('Daftar barang yang dipinjam',160); // Grup field
	echo '<div id="data_peminjaman_buku" style="width:700px;max-height:180px;height:180px;overflow:auto">';
		require_once(APPDIR.'peminjaman_buku_tabel.php');
	echo '</div>';
	
$xform->table_end();
?>