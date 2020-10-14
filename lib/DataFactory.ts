import type * as RDF from 'rdf-js';
import { BlankNode } from './BlankNode';
import { DefaultGraph } from './DefaultGraph';
import { Literal } from './Literal';
import { NamedNode } from './NamedNode';
import { Quad } from './Quad';
import { Variable } from './Variable';

let dataFactoryCounter = 0;

/**
 * A factory for instantiating RDF terms and quads.
 */
export class DataFactory<Q extends RDF.BaseQuad = RDF.Quad> implements RDF.DataFactory<Q> {
  private readonly blankNodePrefix: string;
  private blankNodeCounter = 0;

  public constructor(options?: IDataFactoryOptions) {
    options = options || {};
    this.blankNodePrefix = options.blankNodePrefix || `df_${dataFactoryCounter++}_`;
  }

  /**
   * @param value The IRI for the named node.
   * @return A new instance of NamedNode.
   * @see NamedNode
   */
  public namedNode<Iri extends string = string>(value: Iri): NamedNode<Iri> {
    return new NamedNode(value);
  }

  /**
   * @param value The optional blank node identifier.
   * @return A new instance of BlankNode.
   *         If the `value` parameter is undefined a new identifier
   *         for the blank node is generated for each call.
   * @see BlankNode
   */
  public blankNode(value?: string): BlankNode {
    return new BlankNode(value || `${this.blankNodePrefix}${this.blankNodeCounter++}`);
  }

  /**
   * @param value              The literal value.
   * @param languageOrDatatype The optional language or datatype.
   *                           If `languageOrDatatype` is a NamedNode,
   *                           then it is used for the value of `NamedNode.datatype`.
   *                           Otherwise `languageOrDatatype` is used for the value
   *                           of `NamedNode.language`.
   * @return A new instance of Literal.
   * @see Literal
   */
  public literal(value: string, languageOrDatatype?: string | RDF.NamedNode): Literal {
    return new Literal(value, languageOrDatatype);
  }

  /**
   * This method is optional.
   * @param value The variable name
   * @return A new instance of Variable.
   * @see Variable
   */
  public variable(value: string): Variable {
    return new Variable(value);
  }

  /**
   * @return An instance of DefaultGraph.
   */
  public defaultGraph(): DefaultGraph {
    return DefaultGraph.INSTANCE;
  }

  /**
   * @param subject   The quad subject term.
   * @param predicate The quad predicate term.
   * @param object    The quad object term.
   * @param graph     The quad graph term.
   * @return A new instance of Quad.
   * @see Quad
   */
  public quad(
    subject: Q['subject'],
    predicate: Q['predicate'],
    object: Q['object'],
    graph?: Q['graph'],
  ): Q & Quad {
    return <Q> new Quad(subject, predicate, object, graph || this.defaultGraph());
  }

  /**
   * Create a deep copy of the given term using this data factory.
   * @param original An RDF term.
   * @return A deep copy of the given term.
   */
  public fromTerm<T extends RDF.Term>(original: T):
  (T extends RDF.NamedNode ? NamedNode
    : (T extends RDF.BlankNode ? BlankNode
      : (T extends RDF.Literal ? Literal
        : (T extends RDF.Variable ? Variable
          : (T extends RDF.DefaultGraph ? DefaultGraph
            : (T extends Q ? Q : unknown)))))) {
    // TODO: remove nasty any casts when this TS bug has been fixed:
    //  https://github.com/microsoft/TypeScript/issues/26933
    switch (original.termType) {
      case 'NamedNode':
        return <any> this.namedNode(original.value);
      case 'BlankNode':
        return <any> this.blankNode(original.value);
      case 'Literal':
        if ((<RDF.Literal> original).language) {
          return <any> this.literal(original.value, (<RDF.Literal>original).language);
        }
        if (!(<RDF.Literal> original).datatype.equals(Literal.XSD_STRING)) {
          return <any> this.literal(original.value, this.fromTerm((<RDF.Literal> original).datatype));
        }
        return <any> this.literal(original.value);
      case 'Variable':
        return <any> this.variable(original.value);
      case 'DefaultGraph':
        return <any> this.defaultGraph();
      case 'Quad':
        return <any> this.quad(
          <Q['subject']> this.fromTerm((<Q> <unknown> original).subject),
          <Q['predicate']> this.fromTerm((<Q> <unknown> original).predicate),
          <Q['object']> this.fromTerm((<Q> <unknown> original).object),
          <Q['graph']> this.fromTerm((<Q> <unknown> original).graph),
        );
    }
  }

  /**
   * Create a deep copy of the given quad using this data factory.
   * @param original An RDF quad.
   * @return A deep copy of the given quad.
   */
  public fromQuad(original: Q): Q {
    return <Q> this.fromTerm(original);
  }

  /**
   * Reset the internal blank node counter.
   */
  public resetBlankNodeCounter(): void {
    this.blankNodeCounter = 0;
  }
}

export interface IDataFactoryOptions {
  blankNodePrefix?: string;
}
