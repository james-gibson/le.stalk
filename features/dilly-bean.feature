# features/dilly-bean.feature
# Source: le.stalk/src/stalk.mjs — SEEDS, COLLECTIONS, GRAFTS, MENDEL, bomFor,
#         assertAcyclic, assertGraft, assertCollection, mendelGaps.
# The reference implementation is this repository: npm run check executes it.
#
# A dilly bean is a green bean pickled whole and packed upright — the vine's
# fruit, preserved in the shape it grew. That is the shape of the procedure:
# a seed's inheritance and its bill of materials, kept in the shape they were
# declared. le.stalk introduces this isotope and proposes it for isotope/features/.
#
# 42i-marker: +42
@isotope @lineage @collections
Feature: A lineage is declared, derived and refused
  As someone reading a family of seeds
  I want each seed's inheritance and bill of materials stated as data
  So that a claim about lineage can fail a build rather than a reader

  Scenario: a collection is evaluated, not listed
    Given a collection with a predicate
    When the members are asked for
    Then every member satisfies the predicate
    And a seed that does not satisfy it is not a member

  Scenario: a collection that matches nothing is refused
    Given a collection whose predicate matches no seed
    When the collection is not declared empty
    Then the build stops

  Scenario: a lineage cycle is refused
    Given three seeds that are each cut from the next
    When the lineage is walked
    Then the build stops

  Scenario: an unknown parent is refused
    Given a seed cut from a name that is not in the model
    When the model is loaded
    Then the build stops

  Scenario: a graft without a claim is refused
    Given a seed cut from outside the family
    When the graft names no claim
    Then the build stops

  Scenario: an unfilled layer is unverified, not omitted
    Given a seed whose runtime was never published
    When its bill of materials is built
    Then the runtime layer is present
    And the runtime layer is marked unverified

  Scenario: a Mendel table accounts for every parent trait
    Given a parent with more traits than the crossing names
    When the table is checked
    Then every trait it omits is reported

  Scenario: an isotope names a carrier
    Given an isotope on the shelf
    When the model is loaded
    Then at least one seed carries it
