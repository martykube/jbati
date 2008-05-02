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

my $wc = new HTML::WikiConverter(
	dialect => 'GoogleCode',
	escape_autolink => \@toEscape,
	escape_entities => 0);

my $html = do { local $/; <> };
my $converted = $wc->html2wiki($html);
print $converted, "\n";


__END__
:endofperl
