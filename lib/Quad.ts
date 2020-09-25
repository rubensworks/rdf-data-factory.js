import type * as RDF from 'rdf-js';

/**
 * An instance of DefaultGraph represents the default graph.
 * It's only allowed to assign a DefaultGraph to the .graph property of a Quad.
 */
export class Quad implements RDF.BaseQuad {
  public readonly termType = 'Quad';
  public readonly value = '';
  public readonly subject: RDF.Term;
  public readonly predicate: RDF.Term;
  public readonly object: RDF.Term;
  public readonly graph: RDF.Term;

  public constructor(
    subject: RDF.Term,
    predicate: RDF.Term,
    object: RDF.Term,
    graph: RDF.Term,
  ) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.graph = graph;
  }

  public equals(other?: RDF.Term | null): boolean {
    // `|| !other.termType` is for backwards-compatibility with old factories without RDF* support.
    return !!other && (other.termType === 'Quad' || !other.termType) &&
      this.subject.equals(other.subject) &&
      this.predicate.equals(other.predicate) &&
      this.object.equals(other.object) &&
      this.graph.equals(other.graph);
  }
}
