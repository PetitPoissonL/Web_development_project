# Contribution rules

## Core product team

* Product Owner: [Li Ningyu](https://gaufre.informatique.univ-paris-diderot.fr/poca-project/poca)
* Development Team:
  * [SU LiFang](https://gaufre.informatique.univ-paris-diderot.fr/poca-project/poca)
  * [LI Haoran/](https://gaufre.informatique.univ-paris-diderot.fr/poca-project/poca)
  * [LI Ningyu](https://gaufre.informatique.univ-paris-diderot.fr/su/poca)
  * [LEVY Cindy](https://gaufre.informatique.univ-paris-diderot.fr/su/poca)
  * [WANG Wenchi](https://gaufre.informatique.univ-paris-diderot.fr/poca-project/poca)

* SCRUM master: SU LiFang

## Types of gitlab issues

Developers are assigned user stories. user stories should be as small as possible. The amount of work needed to complete the user story is estimated by the development team:

* S: small user story. Simple and quick to complete.
* M: medium user story. No more than 2 or 3 hours of work.
* L: large user story. It is not easy to imagine what needs to be changed to complete the user story. It should be defined more precisely or/and broken down to smaller user stories if possible.

Bugs should be fixed before new features are added to the product.

## Definition of done

Code under review should be tested.

Installation instructions should always be up to date. If a user story changes how to install the product, the documentation should be updated at the same time.

Bugs and new features should be described briefly in `CHANGELOG.md`.

## Branching

Each user story is implemented on a separate branch named `<contributor>-<user story name>` (e.g. `bouchra-contributing`).

Changes are integrated to the branch `main` after the following steps:

* another member of the development team approved a code review (if the change is important, each member should approve) ;
* the tests are passing ;
* the branch has been rebased on the branch `main`.

See https://medium.com/faun/how-to-rebase-and-merge-with-git-a9c29b2172ad.
