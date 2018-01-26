Feature: A passing feature

    In order to successfully generate a report
    As a tester
    I want to run a passing scenario

    Scenario: A passing scenario
        Given I visit "/index.html"
        When I click the clickable region
        Then I should get the result: 1
