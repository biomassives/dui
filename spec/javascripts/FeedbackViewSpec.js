describe("FeedbackView", function() {
  var view

  beforeEach(function() {
    loadFixtures('feedback_view.html')
    view = new FeedbackView({
      el: $('.feedback'),
      delay: 100,
      queueDelay: 50,
      animationDuration: 100
    })
  });

  describe("when rendering", function() {
    it("displays the feedback message", function() {
      view.render()
      expect($('.feedback-content')).toBeVisible()
      expect($('.feedback')).toHaveClass('feedback-active')
    });

    it("hides the feedback message after the delay period", function() {
      runs(function () {
        view.render()
      })

      waitsFor(function () {
        return !$('.feedback').hasClass('feedback-active')
      }, "the feedback element to be hidden", 500)
    });

    describe("with a message", function() {
      it("renders the feedback message template, with the message", function() {
        var message = 'My new message'
        view.render(message)
        expect($('.feedback').text()).toMatch(message)
      });

      describe("and a message_type", function() {
        it("renders the feedback message with the message type", function() {
          view.render('some message', 'alert-success')

          expect($('.feedback .feedback-content .alert')).toHaveClass('alert-success')
        });
      });
    });

    describe("when rendering another message before the last one is displayed", function() {
      var message = "some normal message",
          queuedMessage = "some queued message",
          otherMessage = "other message"

      it("displays the message to be displayed now", function() {
        view.render(message, 'message')

        view.render(otherMessage, 'other-message')
        expect($('.feedback-content').text()).toMatch(otherMessage) // should not change message immediately
        expect(view._queue).toEqual([])
      });

      it("queues the message to be displayed after the queueDelay period when forcing queue", function() {
        runs(function () {
          view.render(message, 'message')
        })

        waitsFor(function () {
          return $('.feedback-content').text().match(message)
        }, "the message to be: '" + message + "' of message type", 400)

        runs(function () {
          view.render(queuedMessage, 'queued-message', false)
          expect($('.feedback-content').text()).not.toMatch(queuedMessage) // should not change message immediately
          expect(view._queue).not.toBeEmpty()
        })
      });
    });
  });
});
