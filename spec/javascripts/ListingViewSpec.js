describe("ListingView", function() {
  var view, listing

  beforeEach(function() {
    LoadingOverlay.fadeDuration = 10
    loadFixtures('listing_view.html')
    jasmine.Ajax.useMock()

    listing = $('.listing-wrapper')
  });

  describe("when reloading", function() {

    it("sends an GET ajax request to load listing, and render the contents of the listing with the response text", function() {
      var data = '<table><tbody><tr><td>some listing data</td></tr></tbody></table>'

      view = new ListingView({ el: listing })
      view.reload()

      request = mostRecentAjaxRequest();
      request.response({status: 200, responseText: data})

      expect(request.url).toBe(listing.data('url'))
      expect(request.method).toBe('GET')

      expect(listing.html()).toBe(data)
    });

    it("displays an overlay over the listing", function() {
      view = new ListingView({ el: listing })
      view.reload()

      expect(listing.parent().find('.loading-overlay')).toBeVisible()
    });

    describe("and the ajax request is successfull", function() {
      it("hides the overlay", function() {
        view = new ListingView({ el: listing })
        view.reload()

        request = mostRecentAjaxRequest();
        request.response({status: 200, responseText: 'some data'})

        waitsFor(function () {
          return listing.parent().find('.loading-overlay').is(':hidden')
        }, 100)

        runs(function () {
          expect(listing.parent().find('.loading-overlay')).toBeHidden()
        })
      });
    });

    describe("and the ajax request returns an error", function() {
      it("hides the overlay", function() {
        view = new ListingView({ el: listing })
        view.reload()

        request = mostRecentAjaxRequest();
        request.response({status: 500, responseText: 'some error'})

        waitsFor(function () {
          return listing.parent().find('.loading-overlay').is(':hidden')
        }, 100)

        runs(function () {
          expect(listing.parent().find('.loading-overlay')).toBeHidden()
        })
      });

      it("renders a feedback message", function() {
        var feedbackView = new FeedbackView({el: $('.feedback')})
        spyOn(feedbackView, 'render')

        view = new ListingView({ el: listing, feedbackView: feedbackView })
        view.reload()

        request = mostRecentAjaxRequest();
        request.response({status: 500, responseText: 'some error'})

        expect(feedbackView.render).toHaveBeenCalledWith(listing.data('error-message'), 'alert-error', true)
      });
    });
  });
});

describe("DestroyableListingView", function() {
  var view, listing

  beforeEach(function() {
    LoadingOverlay.fadeDuration = 10
    loadFixtures('listing_view.html')
    jasmine.Ajax.useMock()

    listing = $('.listing-wrapper')
  });

  it("is a ListingView", function() {
    expect(new DestroyableListingView({el: listing})).toBeAnInstanceOf(ListingView)
  });

  it("has a ConfirmableModalView", function() {
    view = new DestroyableListingView({el: listing})
    expect(view.confirmableModalView).toBeAnInstanceOf(ConfirmableModalView)
  });

  it("has a ConfirmableView", function() {
    view = new DestroyableListingView({el: listing})
    expect(view.confirmableView).toBeAnInstanceOf(ConfirmableView)
  });

  it("has a configured with the ConfirmableModalView", function() {
    view = new DestroyableListingView({el: listing})
    expect(view.confirmableView.modal).toBeAnInstanceOf(ConfirmableModalView)
  });

  it("uses the same listing element to the ConfirmableView", function() {
    view = new DestroyableListingView({el: listing})
    expect(view.confirmableView.el).toBe(view.el)
  });

  it("reloads the list when confirmable view is confirmed", function() {
    var data = '<table><tbody><tr><td>some listing data</td></tr></tbody></table>'

    view = new DestroyableListingView({el: listing})
    view.confirmableView.trigger('confirmable:confirmed')

    request = mostRecentAjaxRequest();
    request.response({status: 200, responseText: data})

    expect(listing.html()).toBe(data)
  });

  describe("when customizing the modal", function() {
    it("passes these options to the ConfirmableModalView", function() {
      view = new DestroyableListingView({ el: listing, modalOptions: { content: 'modal-content' } })
      expect(view.confirmableModalView.options.content).toBe('modal-content')
    });
  });
});