function fillGoogleForm() {
    const formUrl = "https://docs.google.com/forms/d/1TyTcCMeNZuBcYkMRTP4acZ76HO_G0y74Zx3-BitTUew/edit"; // Replace with your form's Edit URL. Do not copy the responder link
    const form = FormApp.openByUrl(formUrl);
  
    const responses = {
      "this is": {
        values: [1, 2, 3, 4, 5], // linear scale question
        weights: [0.20, 0.30, 0.10, 0.25, 0.15], // Weighted percentages for each option
      },
      "Which one is the JavaScript extension?": { // Multiple choice question
      values: ['.js', '.ejs', '.mjs', 'All'],
      weights: [0.50, 0.10, 0.20, 0.20],
    },
    "Which one is the JavaScript extension?":{ // checkbox question
        values: [[".js"],[".js",".ejs"],[".js",".ejs",".mjs"]],
        weights: [0.50, 0.10, 0.20, 0.20],
    },
    "What is your favorite color?": { // Short answer question
      values: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
      weights: [0.30, 0.25, 0.15, 0.20, 0.10], 
    }
    };
  
    for (let i = 0; i < 5; i++) { // Generate 100 responses
      const formResponse = form.createResponse();
  
      form.getItems().forEach((item) => {
        const questionTitle = item.getTitle();
        if (responses[questionTitle]) {
          const options = responses[questionTitle].values;
          const weights = responses[questionTitle].weights;
  
          // Select an option based on the weighted percentage
          const randomOption = weightedRandom(options, weights);
  
          // Handle different question types
          switch (item.getType()) {
            case FormApp.ItemType.SCALE: // Correct type for linear scale
              formResponse.withItemResponse(
                item.asScaleItem().createResponse(randomOption)
              );
              break;
  
            case FormApp.ItemType.MULTIPLE_CHOICE:
              formResponse.withItemResponse(
                item.asMultipleChoiceItem().createResponse(randomOption)
              );
              break;
  
            case FormApp.ItemType.CHECKBOX:
              formResponse.withItemResponse(
                item.asCheckboxItem().createResponse(randomOption)
              );
              break;
  
            case FormApp.ItemType.TEXT:
              formResponse.withItemResponse(
                item.asTextItem().createResponse(randomOption)
              );
              break;
  
            case FormApp.ItemType.PARAGRAPH_TEXT:
              formResponse.withItemResponse(
                item.asParagraphTextItem().createResponse(randomOption)
              );
              break;
  
            default:
              Logger.log(`Unhandled question type: ${item.getType()}`);
          }
        }
      });
  
      formResponse.submit(); // Submit the response
    }
  }
  
  // Helper function to pick a random option based on weighted percentages
  function weightedRandom(options, weights) {
    let sum = 0;
    const random = Math.random();
  
    // Create a cumulative distribution of the weights
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return options[i];
      }
    }
  
    return options[options.length - 1]; // Return last option if no match (for rounding issues)
  }
  