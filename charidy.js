// @barge suite="charidy" framework="casperjs_test" args="--ignore-ssl-errors=true --ssl-protocol=any"


var test_id = Math.random() * 100000000000000000;
casper.test.begin("charidy.com", 3, function(test) {
  var __utils__ = require('clientutils').create();

  casper.start();
  casper.onResourceRequested = function(requestData, networkRequest) {
    console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
  };
  casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

  casper.viewport(1600, 1200);
  casper.thenOpen('https://www.charidy.com/demofundraiser');


  casper.waitUntilVisible('a.big-green', function() {
    test.pass('a.big-green is visible')
  }, function() {
    test.success("a.big-green not visible");
  });

  casper.thenClick('a.big-green');

  casper.waitUntilVisible('#formbodydonationform');

  casper.then(function() {

      this.sendKeys('input[name=donate_amount]', '0.01');
      this.sendKeys('input[name=first_name]', "fname_" + test_id);
      this.sendKeys('input[name=last_name]', "lname_" + test_id);
      this.sendKeys('input[name=cc_number]', '4111111111111111');
      this.sendKeys('input[name=cc_cvv2]', '111');
      this.sendKeys('input[name=address_1]', '111 test st');
      this.sendKeys('input[name=city]', 'test');
      this.sendKeys('input[name=postcode]', '11111');

      this.sendKeys('.donation-fields input[name=email]', 'test_' + test_id + '@testing.com');
      this.sendKeys('.donation-fields input[name=password]', 'password');
      this.sendKeys('.donation-fields input[name=confirm]', 'password');

      this.click('input[type=checkbox][name=agree]');
  });

  casper.thenEvaluate(function() {
    document.querySelector('select[name=cc_expire_month]').value = '01'; 
    document.querySelector('select[name=cc_expire_year]').value = '2017'; 
    document.querySelector('select[name=zone_id]').value = '3613'; 
    document.querySelector('input[name=agree]').value = '1';
    return true;
  })

  casper.waitFor(function() {
    var ready = !(__utils__.getFieldValue('rec_amount') == '');
    if (ready) {
      test.pass('rec_amount not blank');
    }
   return ready;
  }, function() {}, function() {
    test.fail('rec_amount blank');
  })

  casper.thenClick('a#button-donate-now');

  casper.waitUntilVisible('#formbodysuccess .thanx', function() {
    test.pass('thanks popup')
  }, function() {
    test.fail('success never came');
  });

  casper.wait(1000);

  casper.run(function(){
    test.done();
  });
});