@rem = '--*-Perl-*--
@echo off
if "%OS%" == "Windows_NT" goto WinNT
perl -x -S "%0" %1 %2 %3 %4 %5 %6 %7 %8 %9
goto endofperl
:WinNT
perl -x -S %0 %*
if NOT "%COMSPEC%" == "%SystemRoot%\system32\cmd.exe" goto endofperl
if %errorlevel% == 9009 echo You do not have Perl in your PATH.
if errorlevel 1 goto script_failed_so_exit_with_non_zero_val 2>nul
goto endofperl
@rem ';
#!/usr/bin/perl -w

package main;
use strict;
use HTML::WikiConverter;

my @toEscape = qw/
		SqlMapClient
		JBati
		SqlMapClientBuilder
		JavaScript
		NovaJug
		ExampleJSS
		SqlLite
		ExamplesJSS
		SqlMap
		MySql
		SqlMapConfig
		DevGuide
/;

my %to_process = qw /
	..\docs\DevelopersGuide.html ..\..\wiki\DevelopersGuide.wiki
/;

my $wc = new HTML::WikiConverter(
	dialect => 'GoogleCode',
	escape_autolink => \@toEscape,
	escape_entities => 0,
	base_uri => 'http://beavercreekconsulting.com',
	summary => 'Developers Guide V0.2 - jBati usage and examples'
);

foreach my $in (keys %to_process) {

	open(HTML, "<$in") or die "cannot open $in: $!\n";	
	my $html = do {local $/; <HTML>};
	close(HTML);

	open(WIKI, '>' . $to_process{$in}) or die "cannot open " . 
		$to_process{$in} . ": $!\n";	
	my $converted = $wc->html2wiki($html);
	print WIKI $converted, "\n";
	close(WIKI);
	
}
__END__
:endofperl
