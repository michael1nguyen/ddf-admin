/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*jshint strict:false*/
/*global CasperError, console, phantom, require, casper*/
casper.options.viewportSize = {width: 2452, height: 868};
casper.options.waitTimeout = 100000;

casper.test.begin('Application Selection View test', function(test) {
    casper.start('http://localhost:8383');

    casper.waitForSelector('#welcome',
    function success() {
        test.pass('Found welcome container div');
    },
    function fail() {
        test.fail('Did not find welcome container div');
    });

    casper.waitForSelector('#applications',
    function success() {
        test.pass('Found applications container div');
    },
    function fail() {
        test.fail('Did not find applications container div');
    });

    casper.waitFor(function() {
       return this.evaluate(function() {
           return document.querySelectorAll('#startStep').length === 1;
       });
    }, function() {
       test.assertExists('#startStep');
       this.click('#startStep');
    }, function() {
       test.fail('Failed start button');
    });

    casper.waitFor(function() {
      return this.evaluate(function() {
          return document.querySelectorAll('#config-form').length === 1;
      });
    }, function() {
      test.pass('Found config form');
    }, function() {
      test.fail('Failed finding config form');
    });

    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('#nextStep').length === 1;
        });
    }, function() {
        test.assertExists('#nextStep');
        this.click('#nextStep');
    }, function() {
        test.fail('Failed start button');
    });

    // verify that the apps-tree view shows up
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('#apps-tree').length === 1;
        });
    }, function() {
        test.pass('Found applications tree view');
    }, function() {
        test.fail('Failed finding applications tree view');
    });

    // verify that each of the 10 applications in the test data show up in the tree
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('span.appitem').length === 10;
        })
    }, function() {
        test.pass('Found 10 applications in tree');
    }, function() {
        test.fail('Failed to find 10 applications in tree');
    });

    // verify that selecting the solr app selects the catalog app and the platform app
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('#solr-appcb').length === 1;
        });
    }, function() {
        test.assertExists('#solr-appcb');
        this.click('#solr-appcb');
        test.pass('Clicked the solr-app checkbox');
    }, function() {
        test.fail('Failed to locate the solr-app checkbox');
    });

    casper.waitFor(function() {
        return this.evaluate(function() {
           return document.querySelectorAll('input#solr-appcb:checked').length == 1;
        });
    }, function() {
        test.pass('solr app checked');
    }, function() {
        test.fail('Failed to locate checked solr app');
    });
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('input#catalog-appcb:checked').length == 1;
        });
    }, function() {
        test.pass('catalog app checked');
    }, function() {
        test.fail('Failed to locate checked catalog app');
    });
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('input#platform-appcb:checked').length == 1;
        });
    }, function() {
        test.pass('platform app checked');
    }, function() {
        test.fail('Failed to locate checked platform app');
    });

    // verify that deselecting the catalog app deselects the solr app
    casper.then(function() {
        test.assertExists('#catalog-appcb');
        this.click('#catalog-appcb');
        test.pass('catalog app checkbox de-selected');
    });

    // wait for selections of the catalog and it's sub-children to disappear from the tree
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('input#catalog-appcb:checked').length == 0;
        });
    }, function() {
        test.pass('catalog app unchecked');
    }, function() {
        test.fail('Failed to find unchecked catalog app');
    });
    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('input#solr-appcb:checked').length == 0;
        });
    }, function() {
        test.pass('solr app unchecked');
    }, function() {
        test.fail('Failed to find unchecked solr-app');
    });

    // verify that hovering over an app causes the details region to be displayed
    casper.then(function(){
        test.assertExists('#spatial-apptxt');
        this.mouseEvent('mouseover', '#spatial-apptxt');
        test.pass('Hovering over the spatial app');
    });
    casper.waitForSelector('td#detailsName',
    function success() {
        test.pass('Spatial application details visible.');
    }, function fail() {
        test.fail('Spatial application details not found.');
    });

    casper.then(function() {
        test.assertTrue(this.evaluate(function() {
                return document.querySelector('#detailsName').innerText == 'Spatial App';
            }
        ));
        test.assertTrue(this.evaluate(function() {
                return document.querySelector('#detailsVersion').innerText == '2.4.1-SNAPSHOT';
            }
        ));
        test.assertTrue(this.evaluate(function() {
                return document.querySelector('#detailsDesc p').innerText == 'DDF Spatial Services application default installations';
            }
        ));
    });

    // verify that not hovering cuases the details region to disappear
    casper.then(function(){
       this.mouseEvent('mouseout', '#spatial-apptxt');
        test.pass('Stopped hovering over the spatial app');
    });
    casper.waitWhileSelector('td#detailsName',
        function success(){
            test.pass('Spatial application details hidden');
        },
        function fail() {
            test.fail('Spatial application details did not disappear');
        }
    );

    // verify that app names with the version are broken apart for the display details
    casper.then(function(){
        test.assertExists('#search-app-231ALPHA3-SNAPSHOTtxt');
        this.mouseEvent('mouseover', '#search-app-231ALPHA3-SNAPSHOTtxt');
        test.pass('Hovering over the search app');
    });
    casper.waitForSelector('td#detailsName',
        function success() {
            test.pass('Search application details visible.');
        }, function fail() {
            test.fail('Search application details not found.');
        });

    casper.then(function() {
        test.assertTrue(this.evaluate(function() {
                return document.querySelector('#detailsName').innerText == 'DDF Search UI';
            }
        ));
        test.assertTrue(this.evaluate(function() {
                return document.querySelector('#detailsVersion').innerText == '2.3.1.ALPHA3-SNAPSHOT';
            }
        ));
    });

//    casper.waitForSelector('#bogus',
//        function success() {
//        }, function fail() {
//        });

   casper.run(function() {test.done();});
});
