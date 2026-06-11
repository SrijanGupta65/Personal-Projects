fisrt see how many potential illness there are in teh data. 

see how many records of each illness we have. this is to determine if there might be any potential biases that might happen because of having too many of one of the illness. (create a balanced data set for training).

Select the features

use sentence transformer to embedd textual data.


split the data. use a 70-15-15 split
 - dropped the one rare case with only one patient data. (figure out a way to include this probably in other)

compare random forest with xgboost model. do teh following for each model:

    use a learning rate curve to pick the best learning rate for each model
    train each model on the best learning rate

    compare random forest vs xgboost and pick the best model

use pca on teh data to test if pca helps or not


re-train the best model on training + validation and then test it using testing data




