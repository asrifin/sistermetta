<?php
include 'includes/config.php';
include 'includes/mysql.php';
include 'includes/configsitus.php';
global $koneksi_db,$url_situs;
if(isset($_POST['kode'])){
$kode 		= $_POST['kode'];
}else{
$kode 		= $_GET['kode'];	
}
if(isset($_POST['bayarnominal'])){
$noinvoice 		= $_POST['kode'];	
$bayarnominal 		= $_POST['bayarnominal'];	
$query 		= mysql_query ("update pos_pembelian set bayar ='$bayarnominal', hutang='0' where noinvoice='$noinvoice'");
echo '<meta http-equiv="refresh" content="1; url=admin.php?pilih=hutang&mod=yes" />';
echo "<script type=\"text/javascript\">
        window.open('cetak_notainvoice.php?kode=".$kode."&lihat=ok', '_blank')
    </script>";	
//$style_include[] ='<meta http-equiv="refresh" content="1; url=cetak_notainvoice.php?kode='.$kode.'&cetak=ok" />';
	}
echo "<html><head><title>Nota Transaksi Pembelian </title>";
echo '<style type="text/css">
   table { page-break-inside:auto; 
    font-size: 0.9em; /* 14px/16=0.875em */
font-family: "Times New Roman", Times, serif;
   }
   tr    { page-break-inside:avoid; page-break-after:auto }
	table {
    border-collapse: collapse;}
	th,td {
    padding: 5px;
}
.border{
	border: 1px solid black;
}
.border td{
	border: 1px solid black;
}
body {
	margin		: 0;
	padding		: 0;
    font-size: 1em; /* 14px/16=0.875em */
font-family: "Times New Roman", Times, serif;
    margin			: 2px 0 5px 0;
}
img {
    float: left;
	margin : 5px 5px 0 0;
	padding:1px;
}
</style>';
echo "</head><body>";
echo'
<table align="center"><tr><td>';
echo'<table  width="100%">
<tr><td><img src="images/logo.png" height="70px"></td></tr></table>';
echo'</td></tr><tr><td>';
$no=1;
$query 		= mysql_query ("SELECT * FROM `pos_pembelian` WHERE `noinvoice` like '$kode'");
$data 		= mysql_fetch_array($query);
$noinvoice  			= $data['noinvoice'];
$nopo  			= $data['nopo'];
$tgl  			= $data['tgl'];
$kodesupplier  			= $data['kodesupplier'];
$carabayar  			= $data['carabayar'];
$total  			= $data['total'];
$discount  			= $data['discount'];
$netto  			= $data['netto'];
$bayar  			= $data['bayar'];
$termin  			= $data['termin'];
	$error 	= '';
		if (!$noinvoice) $error .= "Error: kode Invoice tidak terdaftar , silahkan ulangi.<br />";
	if ($error){
		echo '<div class="error">'.$error.'</div>';}else{

		echo '
<table>';
echo '
	<tr>
		<td>Nomor Invoice</td>
		<td>:</td>
		<td>'.$noinvoice.'</td>
	</tr>';
	
	if($nopo!=''){
	$lihatslippo = '<a href="cetak_notapo.php?kode='.$data['nopo'].'&lihat=ok"target="blank">'.$data['nopo'].'</a>';
echo '
	<tr>
		<td>Nomor PO</td>
		<td>:</td>
		<td>'.$lihatslippo.'</td>
	</tr>';}
	
echo '
	<tr>
		<td>Tanggal</td>
		<td>:</td>
		<td>'.tanggalindo($tgl).'</td>
	</tr>';
echo '
	<tr>
		<td>Supplier</td>
		<td>:</td>
		<td>'.getnamasupplier($kodesupplier).'</td>
	</tr>';	
echo '
	<tr>
		<td>Cara Pembayaran</td>
		<td>:</td>
		<td>'.$carabayar.'</td>
			<td></td>
	</tr>';	
if($carabayar=='Hutang'){
echo'
	<tr>
		<td>Termin</td>
		<td>:</td>
		<td>'.$termin.' Hari</td>
			<td></td>
	</tr>';	
	}
echo '</table>';	
echo '<b>Detail Transaksi Pembelian</b>';	
echo '
<table>';
echo '	
<tr>
<th class="border"><b>No</b></</th>
<th class="border"><b>Jenis</b></</th>
<th class="border"><b>Jenjang</b></</th>
<th class="border"><b>Kode</b></</th>
<th class="border"><b>Nama</b></td>
<th class="border"><b>Jumlah</b></</td>
<th class="border"><b>Harga</b></</th>
<th class="border"><b>Discount</b></</th>
<th class="border"><b>Subtotal</b></</th>
	</tr>';
$hasild = $koneksi_db->sql_query("SELECT * FROM `pos_pembeliandetail` WHERE `noinvoice` like '$kode'");
while ($datad =  $koneksi_db->sql_fetchrow ($hasild)){
echo '	
<tr>
<td class="border">'.$no.'</td>
<td class="border">'.getjenisbarang($datad["kodebarang"]).'</td>
<td class="border">'.getjenjangbarang($datad["kodebarang"]).'</td>
<td class="border">'.$datad["kodebarang"].'</td>
<td class="border">'.getnamabarang($datad["kodebarang"]).'</td>
<td class="border">'.$datad["jumlah"].'</td>
<td class="border">'.rupiah_format($datad["harga"]).'</td>
<td class="border">'.cekdiscountpersen($datad["subdiscount"]).'</td>
<td class="border">'.rupiah_format($datad["subtotal"]).'</td>
</tr>';
	$no++;
		}
	/*
echo '	
	<tr class="border">	
		<td colspan="7" align="right"><b>Discount</b></td>
		<td >'.cekdiscountpersen($discount).'</td>
	</tr>';
echo '	<tr class="border">	
		<td colspan="7" align="right"><b>Grand Total</b></td>
		<td >'.rupiah_format($netto).'</td>
	</tr>
	';
	*/
echo '	<tr class="border">	
		<td colspan="8" align="right"><b>Total</b></td>
		<td >'.rupiah_format($total).'</td>
	</tr>
	';
	if((isset($_GET['bayar']) or isset($_POST['bayar']))and($bayar=='0')){
echo '<form class="form-inline" method="POST" action="cetak_notainvoice.php?kode='.$kode.'&lihat=ok" enctype ="multipart/form-data" id="posts">';
echo '<tr class="border">	
		<td colspan="8" align="right"><b>Bayar</b></td>	
	<td>
	<input type="hidden" value="'.$noinvoice.'" name="kode">
	<input type="hidden" value="'.$total.'" name="bayarnominal">'.rupiah_format($total).'</td>
	</tr>';
echo '<tr>
	<td colspan="8" align="right"></td>
	<td>
	<input type="submit" value="Bayar" name="bayar"onclick="return confirm(\'Apakah Anda Yakin Ingin Melunasi Data Ini ?\')"></td>
	</tr></form>';
	}else{
echo '	<tr class="border">	
		<td colspan="8" align="right"><b>Bayar</b></td>
		<td >'.rupiah_format($bayar).'</td>
	</tr>
	';
	}
echo '</table>';	
		}
		echo'</td></tr></table>';
/****************************/
echo "</body</html>";
/*
if (!isset($_GET['lihat'])){
echo "<script language=javascript>
window.print();
</script>";
}
*/
?>
