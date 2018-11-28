<?php
/**
 * ============================================================================
 * 跳转到后台
 */
if(version_compare(PHP_VERSION,'5.4.0','<'))  die ('require PHP > 5.4.0 !');
header("Location:index.php/admin/index/index");

